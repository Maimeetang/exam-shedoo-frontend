"use client";

export default function Login() {
  function CMULogin() {
    console.log("log in!!!");
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[url(/background/login.png)] bg-cover bg-center">
      {/* กล่อง */}
      <div className="grid grid-cols-2 rounded-xl shadow-lg h-[90vh] w-7xl overflow-hidden">
        {/* ฝั่งซ้าย */}
        <div className="flex flex-col items-center justify-between bg-white">
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="mt-10 text-center">
              <h1 className="mb-2 heading-black">Welcome</h1>
              <p className="paragraph-black">
                sign in or create account to get started
              </p>
            </div>
            <button
              className="mt-10 cursor-pointer"
              onClick={() => {
                CMULogin();
              }}
            >
              <img className="w-72" src="/buttons/cmu-login.png" alt="icon" />
            </button>
          </div>
          <p className="justify-self-end my-10 paragraph-black">
            © 2025 Full Stack Group 10. All Rights Reserved.
          </p>
        </div>

        {/* ฝั่งขวา */}
        <div className="flex bg-[#AF9CAF]">
          <div className="mt-5 ml-5">
            <h1 className="mb-2 heading-white font-bold">Schedoo</h1>
            <p className="w-2/3 paragraph-white">
              A scheduling application designed to give you a complete overview
              of your exams and organize your class timetable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
