import { colors } from '@hedviginsurance/brand'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { Mount } from 'react-lifecycle-components'
import { Route, Switch } from 'react-router-dom'
import { GlobalStyles } from './components/GlobalStyles'
import { routes } from './routes'

export const App: React.FunctionComponent<{ nonce?: string }> = ({ nonce }) => (
  <>
    <Mount
      on={() => {
        // tslint:disable-next-line no-console
        console.log(
          `%cHey there! Thanks for checking us out. Curious how we built this? Check out https://github.com/HedvigInsurance to see all our source code.\nLike it, and want to change the insurance industry? Of course we're hiring: https://join.hedvig.com`,
          `font-size: 2rem; font-family: sans-serif; color: ${
            colors.DARK_PURPLE
          }; padding: 2rem; display: block; background-color: #fff;`,
        )
      }}
    >
      {null}
    </Mount>
    <GlobalStyles />
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
  </>
)

export const HotApp = hot(module)(App)
