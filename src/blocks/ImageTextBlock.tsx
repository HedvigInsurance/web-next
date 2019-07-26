import * as React from 'react'
import styled from 'react-emotion'
import {
  ContentWrapper,
  MarginSectionWrapper,
  TABLET_BP_DOWN,
} from '../components/blockHelpers'
import {
  BaseBlockProps,
  ColorComponent,
  MarkdownHtmlComponent,
} from './BaseBlockProps'

import { LinkComponent } from 'src/storyblok/StoryContainer'
import { SectionSize } from 'src/utils/SectionSize'
import { TextPosition } from 'src/utils/textPosition'
import { AppLink } from '../components/AppLink'
import { ButtonLink, ButtonWeight } from '../components/buttons'
import { DeferredImage } from '../components/DeferredImage'
import {
  getStoryblokImage,
  getStoryblokLinkUrl,
  Image as StoryblokImage,
} from '../utils/storyblok'

type TitleSize = 'sm' | 'lg'

const ButtonLinkWithMargin = styled(ButtonLink)({
  marginTop: '1.7rem',
})

const AlignableContentWrapper = styled(ContentWrapper)(
  ({ textPosition }: { textPosition: string }) => ({
    display: 'flex',
    flexDirection: textPosition === 'right' ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    [TABLET_BP_DOWN]: {
      flexDirection: 'column',
    },
  }),
)

const TextWrapper = styled('div')(
  ({ textPosition }: { textPosition: string }) => ({
    textAlign: textPosition === 'center' ? 'center' : 'left',
    width: '100%',
    paddingRight: textPosition === 'left' ? '7rem' : '0',
    paddingLeft: textPosition === 'right' ? '7rem' : '0',
    [TABLET_BP_DOWN]: {
      paddingRight: 0,
      paddingLeft: 0,
    },
  }),
)

const Title = styled('h2')(
  ({
    size,
    displayOrder,
    textPosition,
  }: {
    size?: TitleSize
    displayOrder: 'top' | 'bottom'
    textPosition: TextPosition
  }) => ({
    margin: textPosition === 'center' ? 'auto' : undefined,
    fontSize: size === 'lg' ? '4.5rem' : '2.5rem',
    width: '100%',
    maxWidth: textPosition === 'center' ? '40rem' : '31rem',
    [TABLET_BP_DOWN]: {
      fontSize: size === 'lg' ? '3.75rem' : '2rem',
      marginTop: displayOrder === 'top' ? '3rem' : '1.414rem',
    },
  }),
)

const Paragraph = styled('div')(
  ({ textPosition }: { textPosition: TextPosition }) => ({
    margin: textPosition === 'center' ? 'auto' : undefined,
    fontSize: '1.125rem',
    marginTop: '1.5rem',
    maxWidth: textPosition === 'center' ? '40rem' : '31rem',
  }),
)

const Image = styled(DeferredImage)(
  ({
    alignment,
    displayOrder,
    hasLink,
  }: {
    alignment: string
    displayOrder: 'top' | 'bottom'
    hasLink?: boolean
  }) => ({
    width: hasLink ? '100%' : '40%',
    display: alignment === 'center' ? 'none' : 'block',
    [TABLET_BP_DOWN]: {
      maxWidth: '100%',
      width: 'auto',
      marginTop: displayOrder === 'top' ? '0' : '3rem',
      display: 'block',
      order: displayOrder === 'top' ? -1 : 'initial',
    },
  }),
)
const ImageLink = styled('a')(
  ({ displayOrder }: { displayOrder: 'top' | 'bottom' }) => ({
    display: 'inline-block',
    width: '40%',

    [TABLET_BP_DOWN]: {
      maxWidth: '100%',
      width: 'auto',
      marginTop: displayOrder === 'top' ? '0' : '3rem',
      display: 'block',
      order: displayOrder === 'top' ? -1 : 'initial',
    },
  }),
)

interface ImageTextBlockProps extends BaseBlockProps {
  title_size?: TitleSize
  title: string
  paragraph: MarkdownHtmlComponent
  text_position: TextPosition
  button_title: string
  button_type: 'filled' | 'outlined'
  button_branch_link: boolean
  button_link: LinkComponent
  show_button: boolean
  image?: StoryblokImage
  use_image_link: boolean
  image_link: LinkComponent
  background_image: string
  size: SectionSize
  media_position: 'top' | 'bottom'
  button_color?: ColorComponent
  button_weight?: ButtonWeight
}

export const ImageTextBlock: React.FunctionComponent<ImageTextBlockProps> = ({
  title_size,
  title,
  paragraph,
  text_position,
  button_title,
  button_type,
  button_branch_link,
  button_link,
  show_button,
  image,
  use_image_link,
  image_link,
  background_image,
  color,
  size,
  media_position,
  button_color,
  button_weight,
}) => {
  return (
    <MarginSectionWrapper
      color={color && color.color}
      size={size}
      backgroundImage={background_image}
    >
      <AlignableContentWrapper textPosition={text_position}>
        <TextWrapper textPosition={text_position}>
          <Title
            size={title_size}
            displayOrder={media_position}
            textPosition={text_position}
          >
            {title}
          </Title>
          <Paragraph
            dangerouslySetInnerHTML={{
              __html: paragraph.html,
            }}
            textPosition={text_position}
          />
          {show_button &&
            (button_branch_link ? (
              <AppLink>
                {({ link, handleClick }) => (
                  <ButtonLinkWithMargin
                    href={link}
                    onClick={handleClick}
                    styleType={button_type}
                    size="sm"
                    color={button_color && button_color.color}
                    weight={button_weight}
                  >
                    {button_title}
                  </ButtonLinkWithMargin>
                )}
              </AppLink>
            ) : (
              <ButtonLinkWithMargin
                href={getStoryblokLinkUrl(button_link)}
                styleType={button_type}
                size="sm"
                color={button_color && button_color.color}
                weight={button_weight}
              >
                {button_title}
              </ButtonLinkWithMargin>
            ))}
        </TextWrapper>
        {image &&
          (use_image_link ? (
            <ImageLink
              href={getStoryblokLinkUrl(image_link)}
              displayOrder={media_position}
            >
              <Image
                alignment={text_position}
                displayOrder={media_position}
                src={getStoryblokImage(image)}
                hasLink
              />
            </ImageLink>
          ) : (
            <Image
              alignment={text_position}
              displayOrder={media_position}
              src={getStoryblokImage(image)}
            />
          ))}
      </AlignableContentWrapper>
    </MarginSectionWrapper>
  )
}
