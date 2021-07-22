# Shimmer
The Shimmer component provides an easy way to indicate to users that data is loading in a certain area of the website
without blocking the entire page with a full-screen loader (or worse, an empty space.) This improves the perceived speed of the site,
while maintaining or reducing the CLS (Content Layout Shift) on page load

## General Use
### Props
* **classes** - `Object` Styles to apply to the `root` or the `content` of the Shimmer
* **borderRadius** - `string|number` Border radius of component
* **height** - `string|number` Height to apply to component. **Number is used as `rem`**. String value is used directly.
* **width** - `string|number` Width to apply to component. **Number is used as `rem`**. String value is used directly.
* **style** - `Object` CSS styles to apply to component
* **type** - `'rectangle'|'button'|'checkbox'|'radio'|'textArea'|'textInput'` Base style-category to apply to component
* **children** - `node` Children to output within the Shimmer. Useful for Image placeholders

### Accessibility
To maintain accessibility for screen readers, we can pass `aria-live="polite" aria-busy="true"` to the Shimmer component (or an
element that wraps the Shimmer(s) in a more complex instance).

It's important to then add `aria-live="polite" aria-busy="false"` to the _normal_ component that replaces the shimmer

### Example
```jsx
// ....
import Shimmer from '../path/to/base/Shimmer';
// ....
export default () => {
  // ....
  return (
    <Shimmer />
  );
};
```

## Shimmer for Components
When loading data, previously we would return null (or a full-screen loader) instead of the actual component. We can now return a
_**shimmer**_ version of the component, which will take up the same space without relying on data.

Direct use of the Shimmer component within _normal_ components should be avoided when possible. If the shimmer is replacing a component
that is imported, a `.shimmer.js` file should be created for that imported component in its folder and exported in its `index.js`.

### Example
There are 4 critical files
* **Main.js** - the main component that has the loading status and would usually return null for the component while loading
* **SubComponent/index.js** - Previously would only export the main component. Must now export named variable for shimmer component
* **SubComponent/subComponent** - Same SubComponent as usual
* **SubComponent/subComponent.shimmer.js** - `.shimmer.js` extension is used for easily identifying that it's a shimmer and
  the component it's attached to. It can contain complex arrangement of base Shimmer elements, or include other subcomponents Shimmers.

**Main.js**
```jsx
import React from 'react';
import SubComponent, { SubComponentShimmer } from '../path/to/SubComponent';
// ....
export default () => {
    const { data, isLoading } = fetchData();
    
    if (isLoading) {
        return (
          <SubComponentShimmer />  
        );
    }
    
    if (!data) {
        return 'No data';
    }
    
    return (
        <SubComponent someValue={data} />
    );
};
// ....
```
---
**../path/to/SubComponent/index.js**
```jsx
export { default } from './subComponent.js';
// Export named shimmer component
export { default as SubComponentShimmer } from './subComponent.shimmer.js';
```
---
**../path/to/SubComponent/subComponent.js**
```jsx
import React from 'react';
import { shape, string } from 'prop-types';
import { mergeClasses } from '../../path/to/classify';
import defaultClasses from './subComponent.css';

const SubComponent = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { someValue } = props;
    
    return (
        <div className={classes.root}>
          <div className={classes.item}>{someValue}</div>
        </div>
    );
};

SubComponent.defaultProps = {
    classes: {}
};

SubComponent.propTypes = {
    classes: shape({
      root: string,
      item: string
    })
}

export default SubComponent;
```
---
**../path/to/SubComponent/subComponent.shimmer.js**
```jsx
import React from 'react';
import { mergeClasses } from '../../path/to/classify';
import Shimmer from '../path/to/base/Shimmer';
import defaultClasses from './subComponent.css'; // Load same classes as real SubComponent

const SubComponentShimmer = (props) => {
    // Important to still merge-in prop classes for extensibility/targetability
    const classes = mergeClasses(defaultClasses, props.classes);
    
    return (
      <div className={classes.root}>
        <Shimmer className={classes.item} />
      </div>  
    );
};

SubComponentShimmer.defaultProps = {
  classes: {}
};

SubComponentShimmer.propTypes = {
  classes: shape({
    root: string,
    item: string
  })
}

export default SubComponentShimmer;
```
