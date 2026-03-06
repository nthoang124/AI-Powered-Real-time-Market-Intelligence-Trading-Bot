import { login, signup } from './actions'

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
            <form className="flex w-full max-w-md flex-col space-y-4 rounded-lg bg-gray-800 p-8 shadow-md">
                <h1 className="text-2xl font-bold text-center mb-4">AI Trading Bot Login</h1>

                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required className="rounded px-4 py-2 bg-gray-700 border-gray-600 border focus:border-blue-500 focus:outline-none" />

                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required className="rounded px-4 py-2 bg-gray-700 border-gray-600 border focus:border-blue-500 focus:outline-none" />

                <div className="flex flex-col gap-2 pt-4">
                    <button formAction={login} className="rounded bg-blue-600 px-4 py-2 font-bold hover:bg-blue-700 transition-colors">
                        Log in
                    </button>
                    <button formAction={signup} className="rounded border border-blue-600 px-4 py-2 font-bold hover:bg-blue-600 hover:text-white transition-colors">
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    )
}
