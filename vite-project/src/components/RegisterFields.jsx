import { useForm } from 'react-hook-form';

function RegisterFields({ onSubmit, loading, errorMessage }) {

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <label>
                Firstname
                <input
                    type="text"
                    {...register('firstname', {
                        required: 'Firstname required',
                    })}
                />
            </label>

            <label>
                Lastname
                <input
                    type="text"
                    {...register('lastname', {
                        required: 'Lastname required',
                    })}
                />
            </label>

            <label>
                City
                <input
                    type="text"
                    {...register('city', {
                        required: 'City required',
                    })}
                />
            </label>

            <label>
                Phone
                <input
                    type="text"
                    {...register('phone', {
                        required: 'Phone required',
                    })}
                />
            </label>

            <label>
                Email
                <input
                    type="email"
                    {...register('email', {
                        required: 'Email required',
                    })}
                />
            </label>

            <label>
                Password
                <input
                    type="password"
                    {...register('password', {
                        required: 'Password required',
                        minLength: {
                            value: 8,
                            message: 'Minimum 8 characters',
                        }
                    })}
                />
            </label>

            <label>
                Invite Code
                <input
                    type="text"
                    placeholder="CAPTAIN123 or CREW123"
                    {...register('inviteCode', {
                        required: 'Invite code required',
                    })}
                />
            </label>

            <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Register'}
            </button>

            {errorMessage && <p>{errorMessage}</p>}

        </form>
    );
}

export default RegisterFields;