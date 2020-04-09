import styled from '@emotion/styled'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import { Container } from 'constate'
import React from 'react'
import AnimateHeight from 'react-animate-height'
import { MenuItem as MenuItemType } from '../../storyblok/StoryContainer'
import { getStoryblokLinkUrl } from '../../utils/storyblok'
import { TABLET_BP_DOWN } from './mobile'

const MenuListItem = styled('li')({
  position: 'relative',
  margin: 0,
  padding: 0,
})
const DropdownMenuItemList = styled('ul')<{
  isClosing: boolean
  isOpen: boolean
}>(({ isClosing, isOpen }) => ({
  display: isOpen ? 'flex' : 'none',
  flexDirection: 'column',
  position: 'absolute',
  left: 0,
  top: 'calc(100% + .75rem)',
  listStyle: 'none',
  margin: 0,
  padding: '1.5rem 2rem .5rem 2rem',
  background: colorsV3.gray100,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1), 0px 2px 5px rgba(0, 0, 0, 0.1);',
  opacity: isOpen && !isClosing ? 1 : 0,
  transition: 'opacity 150ms',
  overflowY: 'hidden',
  color: colorsV3.gray900,

  [TABLET_BP_DOWN]: {
    position: 'static',
    boxShadow: 'none',
    padding: '.5rem 1rem',
    background: 'inherit',
    color: 'inherit',
    fontSize: '1.5rem',
  },
}))
const MenuLink = styled('a')({
  color: 'inherit',
  textDecoration: 'none',
  paddingLeft: '3rem',

  [TABLET_BP_DOWN]: {
    display: 'inline-block',
    padding: `1.25rem 1rem 1.25rem 2rem`,
    fontFamily: fonts.FAVORIT,
    fontSize: '2.5rem',

    '&:first-of-type': {
      paddingTop: 0,
    },
  },
})
const MenuFakeLink = styled(MenuLink)({ cursor: 'normal' }).withComponent(
  'span',
)
const DropdownMenuLink = styled(MenuLink)({
  display: 'block',
  whiteSpace: 'nowrap',
  padding: 0,
  paddingBottom: '1rem',

  [TABLET_BP_DOWN]: {
    fontSize: '1.5rem',
  },
})

const Toggler = styled('button')<{ isOpen: boolean }>(({ isOpen }) => ({
  appearance: 'none',
  background: 0,
  border: 0,
  color: 'inherit',

  '&:before': {
    position: 'relative',
    display: 'inline-block',
    content: '" "',
    width: 0,
    height: 0,
    top: -1.5,
    borderWidth: '6px 5px 0 5px',
    borderColor: 'currentColor transparent transparent transparent',
    borderStyle: 'solid',
    [TABLET_BP_DOWN]: {
      top: -8,
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 250ms',
    },
  },
}))

interface State {
  isOpen: boolean
  isClosing: boolean
  closeAnimationTimeout?: number
  closeTimeout?: number
}

interface Effects {
  open: () => void
  close: () => void
  closeWithoutDelay: () => void
}

export const MenuItem: React.FunctionComponent<{ menuItem: MenuItemType }> = ({
  menuItem,
}) => (
  <Container<State, {}, {}, Effects>
    initialState={{
      isOpen: false,
      isClosing: false,
      closeAnimationTimeout: undefined,
      closeTimeout: undefined,
    }}
    effects={{
      open: () => ({ setState, state }) => {
        if (state.closeTimeout) {
          window.clearTimeout(state.closeTimeout)
        }
        if (state.closeAnimationTimeout) {
          window.clearTimeout(state.closeAnimationTimeout)
        }
        setState({
          isOpen: true,
          isClosing: false,
          closeTimeout: undefined,
          closeAnimationTimeout: undefined,
        })
      },
      close: () => ({ setState }) => {
        setState({
          closeTimeout: window.setTimeout(() => {
            setState({
              isOpen: false,
              isClosing: false,
              closeTimeout: undefined,
              closeAnimationTimeout: undefined,
            })
          }, 500),
          closeAnimationTimeout: window.setTimeout(() => {
            setState({ isClosing: true })
          }, 250),
        })
      },
      closeWithoutDelay: () => ({ setState }) => {
        setState({
          isClosing: true,
          closeTimeout: window.setTimeout(() => {
            setState({
              isClosing: false,
              isOpen: false,
              closeTimeout: undefined,
            })
          }, 250),
        })
      },
    }}
  >
    {({ isOpen, isClosing, open, close, closeWithoutDelay }) => (
      <MenuListItem
        key={menuItem._uid}
        onMouseOver={() => {
          open()
        }}
        onMouseOut={() => close()}
      >
        {menuItem.link && menuItem.link.cached_url ? (
          <MenuLink href={getStoryblokLinkUrl(menuItem.link)}>
            {menuItem.label}
          </MenuLink>
        ) : (
          <MenuFakeLink>{menuItem.label}</MenuFakeLink>
        )}

        {menuItem.menu_items && menuItem.menu_items.length > 0 && (
          <Toggler
            onClick={isOpen ? closeWithoutDelay : open}
            isOpen={isOpen}
          />
        )}

        {menuItem.menu_items && menuItem.menu_items.length > 0 && (
          <AnimateHeight height={isOpen && !isClosing ? 'auto' : 0}>
            <DropdownMenuItemList isOpen={isOpen} isClosing={isClosing}>
              {menuItem.menu_items.map((innerMenuItem) => (
                <MenuListItem key={innerMenuItem._uid}>
                  <DropdownMenuLink
                    href={getStoryblokLinkUrl(innerMenuItem.link)}
                  >
                    {innerMenuItem.label}
                  </DropdownMenuLink>
                </MenuListItem>
              ))}
            </DropdownMenuItemList>
          </AnimateHeight>
        )}
      </MenuListItem>
    )}
  </Container>
)
