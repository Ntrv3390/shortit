import SignIn from "@/components/SignIn"

const page = () => {
  return (
    <div className="mt-36 flex flex-col items-center justify-center">
        <h2 className="text-[#F4EEE0] px-3 lg:px-0 text-4xl lg:text-5xl text-center font-bold leading-[3rem] lg:leading-[4rem]">Hi there👋! Sign In to your account to use ShortIt.</h2>
        <p className="text-[#F4EEE0] text-2xl my-6">Don't worry, it's 100% FREE!</p>
        <SignIn />
    </div>
  )
}

export default page