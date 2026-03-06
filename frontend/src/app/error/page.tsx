export default function ErrorPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-800 p-8 shadow-md">
                <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
                <p>Sorry, something went wrong during the authentication process.</p>
                <a href="/login" className="text-blue-500 hover:underline">Return to Login</a>
            </div>
        </div>
    )
}
