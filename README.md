# React Mobile Cropper

The react mobile cropper is highly inspirited by popular Android mobile croppers. It was created as the demonstration of [react-advanced-cropper](https://github.com/norserium/react-advanced-cropper) possibilities and uses it under the hood. Therefore, its documentation would be helpful in the edge cases.


[Demo](https://advanced-cropper.github.io/react-advanced-cropper/#mobile-cropper) / [Sandbox](https://codesandbox.io/s/react-mobile-cropper-c1bz2)

[![NPM](https://img.shields.io/npm/v/react-mobile-cropper.svg)](https://www.npmjs.com/package/react-mobile-cropper) <a href="https://npmcharts.com/compare/react-mobile-cropper?minimal=true"><img src="https://img.shields.io/npm/dm/react-mobile-cropper.svg?sanitize=true" alt="Downloads"></a>


![](https://github.com/advanced-cropper/react-mobile-cropper/blob/master/example/example.gif?raw=true)

## Install

```bash
npm install --save react-mobile-cropper
```

```bash
yarn add react-mobile-cropper
```

## Usage

```tsx
import React, { useState } from 'react';
import { CropperRef, Cropper } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css'

export const GettingStartedExample = () => {
    const [image, setImage] = useState(
        'https://images.unsplash.com/photo-1599140849279-1014532882fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80',
    );

    const onChange = (cropper: CropperRef) => {
        console.log(cropper.getCoordinates(), cropper.getCanvas());
    };

    return (
        <Cropper
            src={image}
            onChange={onChange}
            className={'cropper'}
        />
    )
};
```

## FAQ

### How to change the cropper's main color?

To change the cropper's main color you should redefine `color` property for the cropper.
```css
.cropper {
	color: red;
}
```
```jsx
<Cropper
	src={src}
	className={'cropper'}
/>
```


## Cropper

| Prop                      | Type                      | Description                                                     			                                                                         | Default
| ------------------------- |---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------| ---------------
| src                       | `string`                  | The cropping image (link / base64)                              			                                                                         |
| stencilType               | `'circle'`, `'rectangle'` | The type of stencil                                    			                                                                                  | `'rectangle'`
| stencilComponent          | `Component`               | The stencil component                                           			                                                                         | `RectangleStencil`
| stencilProps              | `object`                  | The props for the stencil component                             			                                                                         | `{}`
| className                 | `string`                  | The optional class for the root cropper block                   			                                                                         |
| imageClassName            | `string`                  | The optional class for the cropping image                       			                                                                         |
| boundaryClassName         | `string`                  | The optional class for the area.                                			                                                                         |
| backgroundClassName       | `string`                  | The optional class for the background under the image           			                                                                         |
| transitions               | `boolean`, `object`       | Enable / disable auto zoom                                     			                                                                          | `false`
| canvas                    | `boolean`                 | The flag that indicates if canvas should be used                			                                                                         | `true`
| minWidth                  | `number`                  | The minimum width of the stencil (percents)                     			                                                                         |
| minHeight                 | `number`                  | The minimum height of the stencil (percents)                    			                                                                         |
| maxWidth                  | `number`                  | The maximum width of the stencil (percents)                     			                                                                         |
| maxHeight                 | `number`                  | The maximum height of the stencil (percents)                    			                                                                         |
| checkOrientation          | `boolean`                 | Check if EXIF orientation should be checked                     			                                                                         | `true`
| resizeImage               | `boolean`, `object`       | The options for the image resizing ([details](https://advanced-cropper.github.io/react-mobile-cropper/docs/components/Cropper#resizeimage)) | `true`
| moveImage                 | `boolean`, `object`       | The options for the image moving ([details](https://advanced-cropper.github.io/react-mobile-cropper/docs/components/Cropper#moveimage))     | `true`
| imageRestriction          | `string`                  | Set restrictions for image position ('stencil', 'none')                                                                                     | `'stencil'`
| defaultSize               | `object`, `Function`      | The function that returns the default size of the stencil or object                                                                         |
| defaultPosition           | `object`, `Function`      | The function that returns the default position of the stencil or object                                                                     |

See [the documentation](https://advanced-cropper.github.io/react-mobile-cropper/docs/components/Cropper) for more props and details.
Notice, in this cropper props `transitions`, `priority`, and `stencilSize` are not available.

## RectangleStencil

| Prop                      | Type                | Description                                                    | Default
| ------------------------  | ------------------- | -------------------------------------------------------------- | ---------------
| aspectRatio               | `number`            | The aspect ratio                                               |
| minAspectRatio            | `number`            | The minimum aspect ratio                                       |
| maxAspectRatio            | `number`            | The maximum aspect ratio                                       |
| className                 | `string`            | The class for root block of the stencil component              |
| previewClassName          | `string`            | The class for the preview component                            |
| movingClassName           | `string`            | The class applied when user drag the stencil                   |
| resizingClassName         | `string`            | The class applied when user resize the stencil                 |
| boundingBoxClass          | `string`            | The class for the bounding box component                       |
| handlerComponent          | `Component`         | The handler component                                          |
| handlers                  | `object`            | The object of handlers that should be visible or hidden.       |
| handlerClassNames         | `object`            | The object of custom handler classes                           |
| handlerWrapperClassNames  | `object`            | The object of custom handler wrapper classes                   |
| lineComponent             | `Component`         | The handler component                                          |
| lines                     | `object`            | The object of lines  that should be visible or hidden.         |
| lineClassNames            | `object`            | The object of custom line classes                              |
| lineWrapperClassNames     | `object`            | The object of custom line wrapper classes                      |

See [the documentation](https://advanced-cropper.github.io/react-mobile-cropper/docs/components/RectangleStencil) for more props and details.

## License

The source code of this library is licensed under MIT, the documentation content belongs to [Norserium](https://github.com/Norserium), except the photos that belong to their respective owners.
