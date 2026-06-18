/* eslint-env jest */

jest.mock('@rnmapbox/maps', () => {
  const React = require('react');
  const {View} = require('react-native');

  const MapComponent = ({children, ...props}) =>
    React.createElement(View, props, children);

  return {
    __esModule: true,
    default: {
      setAccessToken: jest.fn(),
      StyleURL: {Street: 'mapbox://styles/mapbox/streets-v12'},
      MapView: MapComponent,
      Camera: MapComponent,
      ShapeSource: MapComponent,
      LineLayer: MapComponent,
      PointAnnotation: MapComponent,
    },
  };
});

jest.mock('@react-native-community/geolocation', () => ({
  setRNConfiguration: jest.fn(),
  requestAuthorization: jest.fn(success => success?.()),
  watchPosition: jest.fn(() => 1),
  clearWatch: jest.fn(),
}));

const {NativeModules} = require('react-native');
NativeModules.BackgroundLocation = {
  start: jest.fn(() => Promise.resolve()),
  stop: jest.fn(() => Promise.resolve()),
  isTracking: jest.fn(() => Promise.resolve(false)),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};
