import React, { Dispatch } from "react"

export default React.createContext({
    providerState: null,
    account: null as string,
    library: null,
    error: null as Error,
    setError: (error: Error) => {},
    activate: () => {},
    deactivate: () => {}
});
