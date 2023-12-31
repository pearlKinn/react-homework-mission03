import pb from '@/api/pocketbase';
import Alert from '@/components/Alert';
import Logo from '@/components/Logo';
import debounce from '@/utils/debounce';
import { emailReg, pwReg } from '@/utils/validation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  let emailError = '';
  let passwordError = '';
  const emailCheck = emailReg(formState.email)
  const pwdCheck = pwReg(formState.password)
  const isActive = !!(emailCheck && pwdCheck);

  if (!formState.email) {
    emailError = '이메일을 입력해주세요.';
  } else if (!emailCheck) {
    emailError = '올바른 이메일 형식을 입력해주세요';
  }

  if (!formState.password) {
    passwordError = '비밀번호를 입력해주세요.';
  } else if (!pwdCheck) {
    passwordError = '6~16자의 영문, 숫자, 특수문자를 포함해주세요.';
  }

  const handleSignIn = async (e) => {
    e.preventDefault();

    const { email, password } = formState;
    try {
      await pb.collection('users').authWithPassword(email, password);
      toast.success('로그인에 성공했습니다', {
        position: 'top-center',
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      navigate('/');
    } catch (error) {
      toast.error('로그인에 실패하였습니다', {
        position: 'top-center',
        ariaProps: {
          role: 'alert',
          'aria-live': 'polite',
        },
      });
      console.error(error);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleDebounceInput = debounce(handleInput, 500);

  return (
    <div
      role="screenWrapper"
      className="h-screen bg-gray-100 h-[calc(var(--vh, 1vh) * 100)]"
    >
      <h2 hidden>로그인</h2>
      <section>
        <div className="flex flex-col items-center pt-12">
          <Link to="/" className="block">
            <Logo width={'135px'} height={'20px'} />
          </Link>
          <form onSubmit={handleSignIn} className="w-80">
            <div className="mt-10">
              <label htmlFor="email" className="text-xs font-semibold">
                이메일 주소
              </label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={formState.email}
                onChange={handleDebounceInput}
                className="border border-gray-300 rounded-lg w-full p-3 mt-2 mb-1 text-sm placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-0"
                placeholder="이메일"
              />
              {formState.email && (
                <div className="flex gap-1 text-xs lg:text-sm text-red-500 absolute">
                  {emailCheck ? '' : <Alert />}
                  {emailError}
                </div>
              )}
              <div className="mt-4 relative">
                <label className="text-xs font-semibold">비밀번호</label>
                <input
                  type="password"
                  name="password"
                  defaultValue={formState.password}
                  onChange={handleDebounceInput}
                  className="border border-gray-300 rounded-lg p-3 mt-2 mb-1 w-full text-sm placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-0"
                  placeholder="비밀번호"
                />
                {formState.password && (
                  <div className="flex gap-1 text-xs lg:text-sm text-red-500 absolute">
                    {pwdCheck ? '' : <Alert />}
                    {passwordError}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                disabled={!isActive}
                className={`flex justify-center py-3 items-center w-full rounded-lg bg-orange-400 outline-none text-white font-semibold ${
                  isActive ? '' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                로그인 하기
              </button>
              <ul className="flex justify-center mt-4">
                <li className="flex items-center">
                  <Link
                    to="/find-user-email"
                    className="text-xs text-gray-500 font-medium outline-none"
                  >
                    아이디 찾기
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-6 inline-block w-0.5 h-3 bg-gray-300"></span>
                </li>
                <li className="flex items-center">
                  <Link
                    to="/reset-user-password"
                    className="text-xs text-gray-500 font-medium outline-none"
                  >
                    비밀번호 찾기
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-6 inline-block w-0.5 h-3 bg-gray-300"></span>
                </li>
                <li className="flex items-center">
                  <Link
                    to="/register"
                    className="text-xs text-gray-500 font-medium outline-none"
                  >
                    회원가입
                  </Link>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
