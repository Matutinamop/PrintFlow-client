import React from 'react'
import { Redirect, Route } from 'wouter'

function PrivateRoute({component: Component, condition, redirectTo, ...rest}) {
  return (
    <Route {...rest}>
        {condition ? <Component/> : <Redirect to={redirectTo}/>}
    </Route>
  )
}

export default PrivateRoute