import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import MediaQuery from 'react-responsive'
import { HedvigSymbol } from '@hedviginsurance/brand'
import { FontSizes, Heading } from 'components/Heading/Heading'
import { LinkComponent } from 'src/storyblok/StoryContainer'
import { SectionSize } from 'src/utils/SectionSize'
import { TextPosition } from 'src/utils/textPosition'
import {
  AlignedButton,
  AlignedButtonProps,
} from '../../components/AlignedButton'
import {
  ContentWrapper,
  getMinimalColorStyles,
  MOBILE_BP_DOWN,
  MOBILE_BP_UP,
  SectionWrapper,
  TABLET_BP_DOWN,
  TABLET_BP_UP,
} from '../../components/blockHelpers'
import { DeferredImage } from '../../components/DeferredImage'
import { DeferredVideo } from '../../components/DeferredVideo'
import {
  getImageDimensions,
  getStoryblokImage,
  Image as StoryblokImage,
} from '../../utils/storyblok'
import {
  BrandPivotBaseBlockProps,
  MarkdownHtmlComponent,
  MinimalColorComponent,
} from '../BaseBlockProps'
import { BackgroundVideo } from './BackgroundVideo'

interface Animateable {
  animate?: boolean
}

const AlignableContentWrapper = styled(ContentWrapper)<{
  textPosition: TextPosition
}>(({ textPosition }) => ({
  padding: '0 1rem',
  display: 'flex',
  position: 'relative',
  flexDirection:
    textPosition === 'right'
      ? 'row-reverse'
      : textPosition === 'center'
      ? 'column'
      : 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  [MOBILE_BP_DOWN]: {
    flexDirection: 'column',
  },
}))

const fadeSlideIn = keyframes({
  from: { opacity: 0, transform: 'translateY(15%)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})
const AnimatedAlignedButton = styled(AlignedButton)<
  Animateable & AlignedButtonProps<MinimalColorComponent>
>(({ animate }) => ({
  opacity: animate ? 0 : 1,
  animation: animate ? fadeSlideIn + ' 1000ms ease-out forwards' : undefined,
  animationDelay: '1000ms',
  width: '100%',
  [MOBILE_BP_UP]: {
    maxWidth: 'auto',
  },
}))

const TextWrapper = styled('div')<{
  textPosition: TextPosition
  textPositionMobile: TextPosition
  isBlockFullWidth: boolean
}>(({ textPosition, textPositionMobile, isBlockFullWidth }) => ({
  position: 'relative',
  textAlign: textPosition === 'center' ? 'center' : 'left',
  width: '100%',
  ...(textPosition === 'left' && {
    paddingLeft: isBlockFullWidth ? '4rem' : 0,
    paddingRight: '4rem',
  }),
  ...(textPosition === 'right' && {
    paddingLeft: '4rem',
    paddingRight: isBlockFullWidth ? '4rem' : 0,
  }),
  [TABLET_BP_DOWN]: {
    paddingRight: textPosition === 'left' ? '3rem' : '0',
    paddingLeft: textPosition === 'right' ? '3rem' : '0',
  },
  [MOBILE_BP_DOWN]: {
    paddingRight: 0,
    paddingLeft: 0,
    textAlign: textPositionMobile,
  },
}))

type DisplayOrder = 'top' | 'bottom'

interface TitleProps {
  displayorder: DisplayOrder
  alignment: TextPosition
}

const Title = styled(Heading)<TitleProps & Animateable>(
  ({ displayorder, alignment, animate }) => ({
    width: '100%',
    maxWidth: alignment === 'center' ? '40rem' : 'none',
    margin: alignment === 'center' ? 'auto' : undefined,
    marginTop: displayorder === 'top' ? '3rem' : '1.414rem',
    opacity: animate ? 0 : 1,
    animation: animate ? fadeSlideIn + ' 500ms forwards' : undefined,
    animationDelay: '1000ms',

    ['br']: {
      display: 'none',
    },

    [TABLET_BP_UP]: {
      marginTop:
        alignment === 'center' && displayorder === 'top' ? '3rem' : '1.414rem',
      ['br']: {
        display: 'block',
      },
    },
  }),
)

const Paragraph = styled('div')<
  {
    textPosition: TextPosition
    colorComponent?: MinimalColorComponent
  } & Animateable
>(({ textPosition, colorComponent, animate }) => ({
  margin: textPosition === 'center' ? 'auto' : undefined,
  fontSize: '1.125rem',
  marginTop: '1.5rem',
  maxWidth: textPosition === 'center' ? '40rem' : '31rem',
  opacity: animate ? 0 : 1,
  animation: animate ? fadeSlideIn + ' 500ms forwards' : undefined,
  animationDelay: '1250ms',
  color: getMinimalColorStyles(colorComponent?.color ?? 'standard')
    .secondaryColor,

  [TABLET_BP_DOWN]: {
    maxWidth: '100%',
    ['br']: {
      display: 'none',
    },
  },
}))

const Image = styled(DeferredImage)<{
  alignment: string
  displayorder: DisplayOrder
  smallImage: boolean
}>(({ alignment, displayorder, smallImage }) => ({
  width: `calc(${smallImage ? '(100% / 3)' : '50%'} - 0.75rem)`,
  display: 'block',
  flexShrink: 0,
  order: alignment === 'center' && displayorder === 'top' ? -1 : 'initial',
  overflow: 'hidden',
  [MOBILE_BP_DOWN]: {
    maxWidth: '100%',
    width: 'auto',
    marginTop: displayorder === 'top' ? '0' : '3rem',
    display: 'block',
    order: displayorder === 'top' ? -1 : 'initial',
  },
}))

const ImageVideoWrapper = styled('div')<{
  alignment: string
  displayorder: DisplayOrder
  smallImage: boolean
}>(({ alignment, displayorder, smallImage }) => ({
  width: `calc(${smallImage ? '(100% / 3)' : '50%'} - 0.75rem)`,
  flexShrink: 0,
  display: 'block',
  order: alignment === 'center' && displayorder === 'top' ? -1 : 'initial',
  overflow: 'hidden',
  [MOBILE_BP_DOWN]: {
    maxWidth: '100%',
    width: 'auto',
    marginTop: displayorder === 'top' ? '0' : '3rem',
    display: 'block',
    order: displayorder === 'top' ? -1 : 'initial',
  },
}))

const ImageVideo = styled(DeferredVideo)({
  width: '100%',
  objectFit: 'cover',
  transition: 'height 1500ms',
  overflow: 'hidden',
})

const Wordmark = styled('div')({
  display: 'inline-flex',
  position: 'absolute',
  marginTop: '0.33em',
  marginLeft: '0.2rem',

  ['svg']: {
    width: '0.625rem',
    height: '0.625rem',
  },

  [TABLET_BP_UP]: {
    marginTop: '0.25em',
    marginLeft: '0.5rem',
    ['svg']: {
      width: '1rem',
      height: '1rem',
    },
  },
})

interface ImageTextBlockProps extends BrandPivotBaseBlockProps {
  animate?: boolean
  title_size?: FontSizes
  title_size_mobile?: FontSizes
  title: string
  title_color?: MinimalColorComponent
  show_hedvig_wordmark?: boolean
  paragraph: MarkdownHtmlComponent
  text_position: TextPosition
  text_position_mobile: TextPosition
  button_title: string
  button_type: 'filled' | 'outlined'
  button_link?: LinkComponent
  show_button: boolean
  image_type: 'image' | 'video'
  image?: StoryblokImage
  mobile_image?: StoryblokImage
  use_image_link: boolean
  image_link: LinkComponent
  image_video_file_location?: string
  mobile_image_video_file_location?: string
  background_type: string
  background_image: string
  background_video_file_location: string
  mobile_background_video_file_location: string
  size: SectionSize
  full_width: boolean
  media_position: DisplayOrder
  media_size_small: boolean
  button_color?: MinimalColorComponent
  button_position_mobile?: 'above' | 'below'
}

export const ImageTextBlockBrandPivot: React.FunctionComponent<ImageTextBlockProps> = ({
  animate,
  extra_styling,
  title_size = 'sm',
  title_size_mobile,
  title,
  title_color,
  paragraph,
  text_position,
  text_position_mobile,
  button_title,
  button_type,
  button_link,
  show_button,
  image_type,
  image,
  mobile_image,
  image_video_file_location,
  mobile_image_video_file_location,
  background_type,
  background_image,
  background_video_file_location,
  mobile_background_video_file_location,
  color,
  size,
  media_position,
  media_size_small,
  button_color,
  button_position_mobile,
  index,
  show_hedvig_wordmark,
  full_width,
}) => {
  const [hasRendered, setHasRendered] = useState(false)

  useEffect(() => {
    setHasRendered(true)
  }, [])

  return (
    <SectionWrapper
      brandPivot
      colorComponent={color}
      size={size}
      backgroundImage={background_type !== 'video' ? background_image : 'none'}
      extraStyling={extra_styling}
    >
      {background_type === 'video' &&
        background_video_file_location &&
        mobile_background_video_file_location && (
          <BackgroundVideo
            desktopImage={background_video_file_location}
            mobileImage={mobile_background_video_file_location}
            baseVideoUrl={background_video_file_location}
            baseMobileVideoUrl={mobile_background_video_file_location}
            backgroundColor="standard"
          />
        )}

      <AlignableContentWrapper
        textPosition={text_position}
        index={index}
        brandPivot
        fullWidth={full_width}
      >
        <TextWrapper
          textPosition={text_position}
          textPositionMobile={text_position_mobile}
          isBlockFullWidth={full_width}
        >
          <Title
            as="h2"
            alignment={text_position}
            animate={animate}
            color={title_color?.color}
            displayorder={media_position}
            size={title_size}
            mobileSize={title_size_mobile}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
            {show_hedvig_wordmark && (
              <Wordmark>
                <HedvigSymbol />
              </Wordmark>
            )}
          </Title>
          <Paragraph
            dangerouslySetInnerHTML={{
              __html: paragraph.html,
            }}
            animate={animate}
            colorComponent={color}
            textPosition={text_position}
          />
          {hasRendered && (
            <MediaQuery query="(min-width: 481px)">
              <AnimatedAlignedButton
                title={button_title}
                type={button_type}
                buttonLink={button_link}
                show={show_button}
                color={button_color}
                size={'md'}
                positionMobile={button_position_mobile}
                animate={animate}
              />
            </MediaQuery>
          )}
        </TextWrapper>
        {hasRendered && (
          <MediaQuery query="(max-width: 480px)">
            <AnimatedAlignedButton
              title={button_title}
              type={button_type}
              buttonLink={button_link}
              show={show_button}
              color={button_color}
              size={'md'}
              positionMobile={button_position_mobile}
              animate={animate}
            />
          </MediaQuery>
        )}
        {image && image_type !== 'video' ? (
          mobile_image ? (
            <>
              {hasRendered && (
                <>
                  <MediaQuery query="(max-width: 480px)">
                    <Image
                      alignment={text_position}
                      displayorder={media_position}
                      smallImage={media_size_small}
                      src={getStoryblokImage(mobile_image)}
                      {...getImageDimensions(mobile_image)}
                    />
                  </MediaQuery>
                  <MediaQuery query="(min-width: 481px)">
                    <Image
                      alignment={text_position}
                      displayorder={media_position}
                      smallImage={media_size_small}
                      src={getStoryblokImage(image)}
                      {...getImageDimensions(image)}
                    />
                  </MediaQuery>
                </>
              )}
            </>
          ) : (
            <Image
              alignment={text_position}
              displayorder={media_position}
              smallImage={media_size_small}
              src={getStoryblokImage(image)}
              {...getImageDimensions(image)}
            />
          )
        ) : (
          image_type === 'video' &&
          image_video_file_location &&
          mobile_image_video_file_location && (
            <ImageVideoWrapper
              alignment={text_position}
              displayorder={media_position}
              smallImage={media_size_small}
            >
              {hasRendered && (
                <>
                  <MediaQuery query="(max-width: 700px)">
                    <ImageVideo src={mobile_image_video_file_location} />
                  </MediaQuery>

                  <MediaQuery query="(min-width: 701px)">
                    <ImageVideo src={image_video_file_location} />
                  </MediaQuery>
                </>
              )}
            </ImageVideoWrapper>
          )
        )}
      </AlignableContentWrapper>
    </SectionWrapper>
  )
}
