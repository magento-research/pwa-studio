import { gql } from '@apollo/client';

export const GET_CMS_PAGE = gql`
    query GetCmsPage(
        $id: Int
        $identifier: String
        $boolId: Boolean = false
        $boolIdentifier: Boolean = false
    ) {
        cmsPageId: cmsPage(id: $id) @include(if: $boolId) {
            url_key
            content
            content_heading
            title
            page_layout
            meta_title
            meta_keywords
            meta_description
        }
        cmsPageIdentifier: cmsPage(identifier: $identifier)
            @include(if: $boolIdentifier) {
            url_key
            content
            content_heading
            title
            page_layout
            meta_title
            meta_keywords
            meta_description
        }
        storeConfig {
            id
            root_category_id
        }
    }
`;

export default {
    getCMSPageQuery: GET_CMS_PAGE
};
