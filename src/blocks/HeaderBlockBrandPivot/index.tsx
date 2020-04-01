import styled from '@emotion/styled'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import { ContextContainer } from 'components/containers/ContextContainer'
import React from 'react'
import { AppLink } from '../../components/AppLink'
import { ContentWrapper } from '../../components/blockHelpers'
import {
  ButtonLinkBrandPivot,
  ButtonStyleType,
} from '../../components/ButtonBrandPivot/Button'
import { Togglable } from '../../components/containers/Togglable'
import MediaQuery from 'react-responsive'
import { HedvigLogotype } from '../../components/icons/HedvigLogotype'
import { HedvigH } from 'components/icons/HedvigH'
import {
  GlobalStory,
  GlobalStoryContainer,
  LinkComponent,
} from '../../storyblok/StoryContainer'
import { getStoryblokLinkUrl } from '../../utils/storyblok'
import {
  BaseBlockProps,
  MinimalColorComponent,
  minimalColorComponentColors,
} from '../BaseBlockProps'
import { MenuItem } from './MenuItem'
import { Burger, TABLET_BP_DOWN, TABLET_BP_UP } from './mobile'

export const WRAPPER_HEIGHT = '6rem'
export const MOBILE_WRAPPER_HEIGHT = '4.5rem'
export const HEADER_VERTICAL_PADDING = '1.2rem'
export const TOGGLE_TRANSITION_TIME = 250

const isBelowScrollThreshold = () =>
  typeof window !== 'undefined' && window.scrollY > 20

const Wrapper = styled('div')<{ inverse: boolean; open: boolean }>(
  ({ inverse, open }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    color: inverse ? colorsV3.white : colorsV3.gray900,
    fontFamily: fonts.FAVORIT,
    transition: 'color 300ms',

    [TABLET_BP_DOWN]: {
      color: colorsV3.white,
      bottom: open ? 0 : undefined,
    },
  }),
)
const Filler = styled('div')({
  height: MOBILE_WRAPPER_HEIGHT,
  [TABLET_BP_UP]: {
    height: WRAPPER_HEIGHT,
  },
})
const HeaderBackgroundFiller = styled('div')<{ transparent: boolean, open: boolean }>(
  ({ transparent, open }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    height: MOBILE_WRAPPER_HEIGHT,
    [TABLET_BP_UP]: {
      height: WRAPPER_HEIGHT,
      backgroundColor: colorsV3.white,
      opacity: transparent ? 0 : 1,
    },
    opacity: 1,
    backgroundColor: open ? colorsV3.black : colorsV3.gray800,
    transitionDuration: '300ms',
    transitionProperty: 'opacity, background-color',
  }),
)

const InnerHeaderWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: MOBILE_WRAPPER_HEIGHT,
  [TABLET_BP_UP]: {
    height: WRAPPER_HEIGHT,
  },
  padding: HEADER_VERTICAL_PADDING + ' 0',
})
const Menu = styled('ul')<{ open: boolean }>(({ open }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  listStyle: 'none',

  [TABLET_BP_DOWN]: {
    position: 'absolute',
    display: 'block',
    zIndex: 101,
    width: '100%',

    height: open ? `calc(100vh - ${MOBILE_WRAPPER_HEIGHT})` : 0,
    top: MOBILE_WRAPPER_HEIGHT,
    bottom: 0,
    right: 0,
    paddingTop: open ? HEADER_VERTICAL_PADDING : 0,
    fontSize: 18,
    background: open ? colorsV3.black : colorsV3.gray900,
    transitionDuration: `${TOGGLE_TRANSITION_TIME}ms`,
    transitionProperty: 'background-color, height, padding-top, color',
    color: open ? colorsV3.white : 'transparent',
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch',
  },
}))

const LogoLink = styled('a')({
  display: 'inline-flex',
  color: 'inherit',
  marginLeft: '1rem',
})

const ButtonWrapper = styled('div')({
  paddingLeft: '3rem',

  [TABLET_BP_DOWN]: {
    paddingTop: '1.5rem',
    paddingLeft: '1rem',
    paddingBottom: HEADER_VERTICAL_PADDING,
  },
})

const RightContainer = styled('div')({
  display: 'flex',
})

const MobileHeaderLink = styled(ButtonLinkBrandPivot)({
  [TABLET_BP_UP]: {
    display: 'none',
  },
})

const Wordmark = styled('div')({
  width: '2rem',
  height: '2rem',
  zIndex: 102,
})

interface HeaderBlockProps extends BaseBlockProps {
  is_transparent: boolean
  inverse_colors: boolean
  override_cta_link?: LinkComponent | null
  override_cta_label?: string | null
  cta_color?: MinimalColorComponent
  cta_style?: ButtonStyleType
  override_mobile_header_cta_label?: string | null
  override_mobile_header_cta_link?: LinkComponent | null
  mobile_header_cta_color?: MinimalColorComponent
  mobile_header_cta_style?: ButtonStyleType
}

enum InverseColors {
  DEFAULT = 'standard-inverse',
  INVERSE = 'standard',
}

export const Header: React.FC<{ story: GlobalStory } & HeaderBlockProps> = (
  props,
) => {
  const [isBelowThreshold, setIsBelowThreshold] = React.useState<boolean>(false)
  const [buttonColor, setButtonColor] = React.useState<
    minimalColorComponentColors | undefined
  >(props.cta_color?.color)

  const updateHeader = () => {
    if (isBelowScrollThreshold()) {
      setIsBelowThreshold(true)
      if (props.inverse_colors) {
        setButtonColor(InverseColors.INVERSE)
      }
      return
    }

    setIsBelowThreshold(false)
    if (props.inverse_colors) {
      setButtonColor(InverseColors.DEFAULT)
    }
  }

  React.useEffect(() => {
    if (!props.is_transparent) {
      return
    }
    updateHeader()
    window.addEventListener('scroll', updateHeader)

    return () => {
      if (!props.is_transparent) {
        return
      }
      window.removeEventListener('scroll', updateHeader)
    }
  }, [updateHeader])

  const mobileHeaderCtaLabel =
    props.override_mobile_header_cta_label || props.story.content.cta_label

  const mobileHeaderCtaLinkSrc =
    props.override_cta_link && props.override_cta_link.cached_url
      ? props.override_cta_link
      : props.story.content.cta_link
  const mobileHeaderCtaLink = getStoryblokLinkUrl(mobileHeaderCtaLinkSrc)

  return (
    <>
      {!props.is_transparent && <Filler />}

      <Togglable>
        {({ isOpen, isClosing, toggleOpen }) => (
          <Wrapper
            inverse={
              props.is_transparent && props.inverse_colors && !isBelowThreshold
            }
            open={isOpen || isClosing}
          >
            <HeaderBackgroundFiller
              transparent={props.is_transparent && !isBelowThreshold}
              open={isOpen}
            />
            <ContentWrapper>
              <InnerHeaderWrapper>
                <RightContainer>
                  <Burger
                    isOpen={isOpen}
                    isClosing={isClosing}
                    onClick={toggleOpen}
                    preventInverse={props.inverse_colors && isOpen}
                  />

                  <MediaQuery query="(min-width: 1001px)">
                  <ContextContainer>
                    {(context) => (
                      <LogoLink
                        href={'/' + (context.lang === 'sv' ? '' : context.lang)}
                      >
                        <HedvigLogotype width={98} />
                      </LogoLink>
                    )}
                  </ContextContainer>
                  </MediaQuery>
                </RightContainer>

                <MediaQuery query="(max-width: 1000px)">
                  <Wordmark>
                    <HedvigH />
                  </Wordmark>
                </MediaQuery>

                <MediaQuery query="(min-width: 1001px)">
                  {!isOpen && (
                    <>
                      {(() => {
                        if (
                          props.override_cta_link?.cached_url ||
                          props.override_mobile_header_cta_link?.cached_url
                        ) {
                          return (
                            <MobileHeaderLink
                              size="sm"
                              styleType={props.mobile_header_cta_style}
                              href={mobileHeaderCtaLink}
                              color={buttonColor}
                            >
                              {mobileHeaderCtaLabel}
                            </MobileHeaderLink>
                          )
                        }

                        if (
                          props.story.content.show_cta &&
                          props.story.content.cta_branch_link
                        ) {
                          return (
                            <AppLink>
                              {({ link, handleClick }) => (
                                <MobileHeaderLink
                                  size="sm"
                                  styleType={props.mobile_header_cta_style}
                                  color={props.mobile_header_cta_color?.color}
                                  onClick={handleClick}
                                  href={link}
                                >
                                  {mobileHeaderCtaLabel}
                                </MobileHeaderLink>
                              )}
                            </AppLink>
                          )
                        }
                        return (
                          <MobileHeaderLink
                            size="sm"
                            styleType={props.mobile_header_cta_style}
                            href={mobileHeaderCtaLink}
                            color={props.mobile_header_cta_color?.color}
                          >
                            {mobileHeaderCtaLabel}
                          </MobileHeaderLink>
                        )
                      })()}
                    </>
                  )}
                </MediaQuery>

                <Menu open={isOpen}>
                  {(props.story.content.header_menu_items ?? []).map(
                    (menuItem) => (
                      <MenuItem menuItem={menuItem} key={menuItem._uid} />
                    ),
                  )}

                  {(() => {
                    const ctaLabel =
                      props.override_cta_label || props.story.content.cta_label

                    if (props.override_cta_link?.cached_url) {
                      return (
                        <ButtonWrapper>
                          <ButtonLinkBrandPivot
                            styleType={props.cta_style}
                            color={buttonColor}
                            href={getStoryblokLinkUrl(props.override_cta_link)}
                          >
                            {ctaLabel}
                          </ButtonLinkBrandPivot>
                        </ButtonWrapper>
                      )
                    }

                    if (
                      props.story.content.show_cta &&
                      props.story.content.cta_branch_link
                    ) {
                      return (
                        <AppLink>
                          {({ link, handleClick }) => (
                            <ButtonWrapper>
                              <ButtonLinkBrandPivot
                                styleType={props.cta_style}
                                color={buttonColor}
                                href={link}
                                onClick={handleClick}
                              >
                                {ctaLabel}
                              </ButtonLinkBrandPivot>
                            </ButtonWrapper>
                          )}
                        </AppLink>
                      )
                    }

                    return (
                      <ButtonWrapper>
                        <ButtonLinkBrandPivot
                          styleType={props.cta_style}
                          color={buttonColor}
                          href={getStoryblokLinkUrl(
                            props.story.content.cta_link,
                          )}
                        >
                          {ctaLabel}
                        </ButtonLinkBrandPivot>
                      </ButtonWrapper>
                    )
                  })()}
                </Menu>
              </InnerHeaderWrapper>
            </ContentWrapper>
          </Wrapper>
        )}
      </Togglable>
    </>
  )
}

export const HeaderBlockBrandPivot: React.FunctionComponent<HeaderBlockProps> = (
  headerBlockProps,
) => (
  <GlobalStoryContainer>
    {({ globalStory }) => <Header story={globalStory} {...headerBlockProps} />}
  </GlobalStoryContainer>
)
