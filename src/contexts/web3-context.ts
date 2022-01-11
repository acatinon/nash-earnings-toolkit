import React from "react"

export default React.createContext({
    providerState: null,
    account: null as string,
    library: null,
    activate: () => {},
    deactivate: () => {}
});
