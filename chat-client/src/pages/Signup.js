import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, provider, signInWithPopup, createUserWithEmailAndPassword } from "../utils/firebase";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";


function SignUp() {
    const db = getFirestore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleGoogleSignUp = async () => {
        try {
            const { user } = await signInWithPopup(auth, provider);

            if (user) {
                const q = query(collection(db, "users"), where("email", "==", user.email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    console.log("El email ya está en uso.");
                    return;
                }

                const userRef = doc(db, 'users', user.uid);

                setDoc(userRef, {
                    name: user.displayName,
                    email: user.email,
                    createdAt: new Date(),
                }, { merge: true });
            }
        } catch (error) {
            console.error("Error al iniciar sesión con Google: ", error);
        }
    };

    const handleSignUp = async (event) => {
        event.preventDefault();

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            if (user) {
                const q = query(collection(db, "users"), where("email", "==", user.email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    console.log("El email ya está en uso.");
                    return;
                }

                const userRef = doc(db, 'users', user.uid);

                setDoc(userRef, {
                    name: name,
                    email: user.email,
                    createdAt: new Date(),
                }, { merge: true });
            }

        } catch (error) {
            console.error("Error al registrar el usuario: ", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Crear una cuenta</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        ¿Ya tienes una cuenta?
                        <Link to="/" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                            Iniciar sesión
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium">
                            Nombre completo
                        </label>
                        <div className="mt-1">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="py-2 px-3 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium">
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="py-2 px-3 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium">
                            Contraseña
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="py-2 px-3 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Crear cuenta
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">o registrese con</span>
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handleGoogleSignUp}
                        >
                            <span className="sr-only">Registrese con Google</span>
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M20 10a10 10 0 11-20 0 10 10 0 0120 0zm-9.317-1.244c-.407-.377-.992-.588-1.583-.588-.59 0-1.175.211-1.582.588-.433.402-.698.975-.698 1.61s.265 1.208.697 1.61            1.583.588c.407.378.892.588 1.407.588.59 0 1.175-.21 1.582-.588.433-.402.698-.975.698-1.61s-.265-1.208-.698-1.61zm5.526.162c-.042.377-.166.726-.365 1.045h.001l-.001.001c-.268.387-.667.694-1.158.89-.644.233-1.36.233-2.004 0-.491-.196-.89-.503-1.159-.89l-.001-.001h.001c-.199-.319-.323-.668-.365-1.045V7.595h-1.73v2.184c0 .312-.257.564-.573.564-.317 0-.573-.252-.573-.564V7.595H8.36c-.045 0-.09.003-.135.007-.044-.004-.089-.007-.135-.007H6.135v2.184c0 .312-.256.564-.573.564-.316 0-.573-.252-.573-.564V7.595H3.99c-.491 0-.89.402-.89.895v6.21c0 .494.399.895.89.895h10.21c.491 0 .89-.401.89-.895v-6.21c0-.493-.399-.895-.89-.895z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="ml-3">Registrese con Google</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}



export default SignUp;
