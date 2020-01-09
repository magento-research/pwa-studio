import React from 'react';
import { storiesOf } from '@storybook/react';

import Accordion from '../accordion';
import Section from '../section';

const stories = storiesOf('Components/Accordion', module);

stories.add('Default', () => {
    return (
        <Accordion>
            <Section title="First">First Contents Here</Section>
            <Section title="Second">Second Contents Here</Section>
            <Section title="Third">Third Contents Here</Section>
        </Accordion>
    );
});

stories.add('A section open initially', () => {
    return (
        <Accordion>
            <Section title="First">First Contents Here</Section>
            <Section title="Second" isOpen={true}>Second Contents Here</Section>
            <Section title="Third">Third Contents Here</Section>
        </Accordion>
    );
});

stories.add('One section allowed open at a time', () => {
    return (
        <Accordion canOpenMultiple={false}>
            <Section title="First">First Contents Here</Section>
            <Section title="Second">Second Contents Here</Section>
            <Section title="Third">Third Contents Here</Section>
        </Accordion>
    );
});

stories.add('One section allowed open + A section open initially', () => {
    return (
        <Accordion canOpenMultiple={false}>
            <Section title="First">First Contents Here</Section>
            <Section title="Second" isOpen={true}>Second Contents Here</Section>
            <Section title="Third">Third Contents Here</Section>
        </Accordion>
    );
});
