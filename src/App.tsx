import { Global } from '@emotion/core'
import { colors } from '@hedviginsurance/brand'
import React from 'react'
import { hot } from 'react-hot-loader'
import { Route, Switch, useLocation } from 'react-router-dom'
import { CookieConsent } from './components/CookieConsent'
import { globalStyles } from './components/GlobalStyles'
import { routes } from './routes'

export const App: React.FunctionComponent<{ nonce?: string }> = ({ nonce }) => {
  const location = useLocation()
  React.useEffect(() => {
    // tslint:disable-next-line no-console
    console.log(
      `%cHey there! Thanks for checking us out. Curious how we built this? You can see all our source code at https://github.com/HedvigInsurance !\nLike it, and want to change the insurance industry? Of course we're hiring: https://join.hedvig.com`,
      `font-size: 2rem; font-family: sans-serif; color: #fff; padding: 2rem; display: block; background-color: ${colors.PURPLE};`,
    )

    if (location.search.includes('xmas')) {
      // @ts-ignore
      import('magic-snowflakes')
        .then((m) => m.default)
        .then((Snowflakes) => Snowflakes())
    }
  }, [])

  return (
    <>
      <Global styles={globalStyles(false)} />
      <Switch>
        {routes.map(({ Component, exact, path }) => (
          <Route
            key={path}
            exact={exact}
            path={path}
            render={(props) => <Component {...props} nonce={nonce} />}
          />
        ))}
      </Switch>
      <CookieConsent />
    </>
  )
}

export const HotApp = hot(module)(App)
