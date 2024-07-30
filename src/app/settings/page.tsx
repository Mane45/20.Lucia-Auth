'use client'
import { useActionState } from "react"
import { handleChange } from "../lib/actions"

export default function Settings() {
    const [state, handleCahngeAction] = useActionState(handleChange, {message:""})
    return <main className="p-4 px-6 mx-6">
        <h1 className="is-size-3">Change password</h1>
        <div className="columns">
            <div className="column is-two-fifths p-4">
                <form className="box" action={handleCahngeAction}>
                    {state?.message && <p style={{color:'red'}}>{state.message}</p>}
                    <div className="field my-4">
                        <input
                            type="text"
                            className="input is-dark"
                            placeholder="please enter your password"
                            name="currentPassword"
                        />
                    </div>
                    <div className="field my-4">
                        <input
                            type="password"
                            className="input is-dark"
                            placeholder="please enter your  new login"
                            name="newlogin"
                        />
                    </div>
                    <button className="button is-success">save changes</button>
                </form>
            </div>
        </div>
    </main>
}