# `<Onboarding />`

Onboarding experience made a breeze.

Originally inspired by [AndroidOnboarder](https://github.com/chyrta/AndroidOnboarder).

## Quick demo

| ![](images/1.png) | ![](images/2.png) | ![](images/3.png) |
| --- | --- | --- |
| Adapts to bright backgrounds | and dark, too | shows the Done button |

```javascript
<Onboarding
  pages={[
    { backgroundColor: '#fff', image: <Square />, title: 'Simple Messenger UI', subtitle: <Text>Implemented in React Native'</Text> },
    { backgroundColor: "#fe6e58", image: <Circle />, title: 'Welcome', subtitle: <Text>To Earth'</Text> },
    { backgroundColor: "#999", image: <Square />, title: 'Also', subtitle: <Text>Mars is nice'</Text> },
  ]}
  onEnd={}
/>
```

## Install

```
npm install --save react-native-simple-onboarding
```

```javascript
import Onboarding from 'react-native-simple-onboarding';
```

## Usage

## `<Onboarding />` component

Props:

* `pages` (required): an array of onboarding pages. A page is an object of shape:
  * `backgroundColor` (required): a background color for the page
  * `image` (required): a component instance displayed at the top of the page
  * `title` (required): a string title
  * `subtitle` (required): a react component
* `onEnd` (optional): a callback that is fired after the onboarding is complete
* `bottomOverlay` (optional): a bool flag indicating whether the bottom bar overlay should be shown. Defaults to `true`.
* `showSkip` (optional): a bool flag indicating whether the Skip button should be show. Defaults to `true`.
* `showNext` (optional): a bool flag indicating whether the Next arrow button should be show. Defaults to `true`.
* `showDone` (optional): a bool flag indicating whether the Done checkmark button should be show. Defaults to `true`.
* `lottie` (optional, overrides images): a Lottie animation that animates when navigating pages. The object has fields:
  * `anim` (required): the rendered animation json,
  * `keyframes` (required): array of target keyframes that each page of the Onboarding should end on,
  * `totalFrames` (required): total amount of frames in the animation.

## To Do

* accessibility

## License

MIT.
