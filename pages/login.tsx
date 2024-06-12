const Login = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-blue-500">
      <form className="p-6 md:p-12 bg-white rounded-2xl">
        <div className="flex items-center text-md mb-6 md:mb-8">
          <input
            type="email"
            id="email"
            className="bg-gray-100 rounded-lg pl-12 py-2 focus:outline-none w-full"
            placeholder="Email"
          />
        </div>
        <div className="flex items-center text-md mb-6 md:mb-8">
          <input
            type="password"
            id="password"
            className="bg-gray-100 rounded-lg pl-12 py-2 focus:outline-none w-full"
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-3 text-white uppercase w-full rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
