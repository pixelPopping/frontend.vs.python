import { useForm } from 'react-hook-form';

function RegisterFields({ onSubmit, loading, errorMessage }) {

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <input placeholder="Firstname" {...register("firstname", { required: true })} />
            {errors.firstname && <p>Required</p>}

            <input placeholder="Lastname" {...register("lastname", { required: true })} />
            {errors.lastname && <p>Required</p>}

            <input placeholder="City" {...register("city", { required: true })} />
            {errors.city && <p>Required</p>}

            <input placeholder="Phone" {...register("phone", { required: true })} />
            {errors.phone && <p>Required</p>}

            <input placeholder="Email" {...register("email", { required: true })} />
            {errors.email && <p>Required</p>}

            <input
                type="password"
                placeholder="Password"
                {...register("password", { required: true, minLength: 8 })}
            />
            {errors.password && <p>Min 8 chars</p>}

            <input placeholder="Invite Code" {...register("inviteCode", { required: true })} />
            {errors.inviteCode && <p>Required</p>}

            <button disabled={loading}>
                {loading ? "Loading..." : "Login"}
            </button>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    );
}

export default RegisterFields;