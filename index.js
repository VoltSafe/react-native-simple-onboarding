import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, View, ScrollView, Dimensions } from 'react-native';
import tinycolor from 'tinycolor2';
import LottieView from 'lottie-react-native';

import PageData from './components/PageData';
import Paginator from './components/Paginator';

const { width, height } = Dimensions.get('window');
const SLIDER_EPSILON = 0.00005

export default class Onboarding extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 0,
      lottiePage: 0,
      curFrame: new Animated.Value(0)
    };
  }

  componentDidMount = () => {
    this.animation && this.animation.play(0, this.props.lottie.keyframes[0])
  }

  updatePosition = (event) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const pageFraction = contentOffset.x / layoutMeasurement.width;
    const page = Math.round(pageFraction);
    const isLastPage = this.props.pages.length === page + 1;
    if (isLastPage && pageFraction - page > 0.3) {
      this.props.onEnd();
    } else {
      this.setState({ currentPage: page })
    }
    
    if (!this.animation)
      return
      
    const lottiePage = Math.floor(pageFraction + SLIDER_EPSILON)
    let curFrame, startFrame
    if (lottiePage < 0) {
      curFrame = (this.props.lottie.keyframes[0] * (1 + pageFraction))
    }
    else if (pageFraction < this.state.lottiePage) {
      
      // If swiping backwards, show reverse animation controllable by swipe
      curFrame = (Math.abs(pageFraction) % 1) *
        (this.props.lottie.keyframes[lottiePage+1] - this.props.lottie.keyframes[lottiePage]) + this.props.lottie.keyframes[lottiePage]
    }
    else {
      curFrame = this.props.lottie.keyframes[this.state.lottiePage]
      if (lottiePage > this.state.lottiePage) {
        this.onScrollEnd(lottiePage)
      }
    }
    this.setState({curFrame: Math.round(curFrame)})
  };

  goNext = () => {
    const { currentPage } = this.state;
    const nextPage = currentPage + 1;
    const offsetX = nextPage * width;
    this.refs.scroll.scrollTo({
      x: offsetX,
      animated: true
    }, () => {
      this.setState({ currentPage: nextPage });
    });
  };

  onScrollEnd = (nextPage) => {
    if (this.state.lottiePage < nextPage) {
      this.animation.play(this.props.lottie.keyframes[this.state.lottiePage], this.props.lottie.keyframes[nextPage])
    }
    this.setState({
      lottiePage: nextPage,
    })
  }

  render() {
    const { pages, bottomOverlay, showSkip, showNext, showDone, lottie } = this.props;
    const currentPage = pages[this.state.currentPage] || pages[0];
    const { backgroundColor } = currentPage;
    const isLight = tinycolor(backgroundColor).getBrightness() > 180;

    return (
      <View style={{ flex: 1, backgroundColor: backgroundColor}}>
        {!!lottie && <LottieView
          source={lottie.anim}
          ref={animation => {
            this.animation = animation;
          }}
          progress={this.state.curFrame/lottie.totalFrames}
          loop={false}
          style={styles.lottie}
        />}
        <ScrollView
          style={styles.scrollview}
          ref="scroll"
          pagingEnabled={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          snapToAlignment={"center"}
          onScroll={this.updatePosition}
          scrollEventThrottle={1}
          onMomentumScrollEnd={e => this.animation && this.onScrollEnd(Math.round(e.nativeEvent.contentOffset.x/width))}
        >
          {pages.map(({ image, title, subtitle, titleStyles, subtitleStyles }, idx) => (
            <PageData
              key={idx}
              isLight={isLight}
              image={!!!lottie && image}
              title={title}
              subtitle={subtitle}
              titleStyles={titleStyles}
              subtitleStyles={subtitleStyles}
              width={width}
              height={!!lottie ? undefined : height}
            />
          ))}
        </ScrollView>
        <Paginator
          isLight={isLight}
          overlay={bottomOverlay}
          showSkip={showSkip}
          showNext={showNext}
          showDone={showDone}
          pages={pages.length}
          currentPage={this.state.currentPage}
          onEnd={this.props.onEnd}
          onNext={this.goNext}
        />
      </View>
    );
  }
}

Onboarding.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
    image: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
  })).isRequired,
  bottomOverlay: PropTypes.bool,
  showSkip: PropTypes.bool,
  showNext: PropTypes.bool,
  showDone: PropTypes.bool,
  lottie: PropTypes.object,
};

Onboarding.defaultProps = {
  bottomOverlay: true,
  showSkip: true,
  showNext: true,
  showDone: true,
};

const styles = {
  lottie: {
    flex: 1,
    alignSelf: 'center',
    width: width*.7,
    height: width*.7,
  },
  scrollview: {
    flex: 1,
  }
}
