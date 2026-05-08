
import { useForm } from 'react-hook-form';

function LoginFields({ onSubmit, loading, errorMessage }) {

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <label>
                Email
                <input
                    type="email"
                    {...register('email', {
                        required: 'Email required',
                    })}
                />
                {errors.email && <p>{errors.email.message}</p>}
            </label>

            <label>
                Password
                <input
                    type="password"
                    {...register('password', {
                        required: 'Password required',
                    })}
                />
                {errors.password && <p>{errors.password.message}</p>}
            </label>

            <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
            </button>

            {errorMessage && <p>{errorMessage}</p>}

        </form>
    );
}

export default LoginFields;