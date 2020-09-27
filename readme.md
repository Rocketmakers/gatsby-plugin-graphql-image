# gatsby-plugin-graphql-image

## Description

Traverses a grapqhl schema sourced from the [gatsby-source-graphql](https://www.gatsbyjs.org/packages/gatsby-source-graphql) plugin and generates file nodes for use with [gatsby-plugin-sharp](https://www.gatsbyjs.org/packages/gatsby-plugin-sharp) and [gatsby-transformer-sharp](https://www.gatsbyjs.org/packages/gatsby-transformer-sharp).

### Dependencies

[gatsby-source-graphql](https://www.gatsbyjs.org/packages/gatsby-source-graphql)<br/>
[gatsby-source-filesystem](https://www.gatsbyjs.org/packages/gatsby-source-filesystem)<br/>
[gatsby-plugin-sharp](https://www.gatsbyjs.org/packages/gatsby-plugin-sharp)<br/>
[gatsby-transformer-sharp](https://www.gatsbyjs.org/packages/gatsby-transformer-sharp)


## How to install

```
npm i -D gatsby-plugin-graphql-image
```

## Available options

`schemaName` - The typeName value of your graphql source from the gatsby-source-grapql plugin<br/>
`imageFieldName` - The name of the field that contains your image URLs or a regular expression<br/>
`imageFieldType` - The type of the field that contains your image URLs or a regular expression<br/>

## Examples of usage

```js
{
  resolve: "gatsby-source-graphql",
  options: {
    typeName: "ROCKETMAKERS",
    fieldName: "rocketmakers",
    url: "https://rocketmakers.com/graphql"
  }
},

{
  resolve: 'gatsby-plugin-graphql-image',
  options: {
    schemaName: "ROCKETMAKERS",
    imageFieldName: "imageUrl"
  }
}
,
{
  resolve: 'gatsby-plugin-graphql-image',
  options: {
    schemaName: "ROCKETMAKERS",
    imageFieldName: /Image$/ // all fields ending in Image
  }
}
,
{
  resolve: 'gatsby-plugin-graphql-image',
  options: {
    schemaName: "ROCKETMAKERS",
    imageFieldType: "Image"
  }
}
```
