<template>
    <v-container fluid class="login-container">
        <v-row no-gutters>
            <!-- Left Side (Login Form) -->
            <v-col class="form-container">
                <!-- Logo and Title -->
                <v-row align="start" class="logo-section">
                    <v-col class="logo-container">
                        <!-- Add the image at the top left corner -->
                        <img src="/images/logo.png" alt="E-Nutrition" class="logo-image" />
                    </v-col>
                    <v-col class="text-container">
                        <h2>E-Nutrition</h2>
                        <p>Personalyzed Meal Planning System</p>
                    </v-col>
                </v-row>

                <!-- Login Form -->
                <v-card-text class="form-card">
                    <h1 style="margin-bottom: 5%; margin-left: 5px; font-size: xx-large;">Sign In</h1>

                    <v-form @submit.prevent="login">
                        <!-- Email Field -->
                        <v-text-field
                            v-model="email"
                            label="Email"
                            type="email"
                            color="#FF42CD"
                            rounded="pill"
                            required
                            variant="outlined"
                            class="mb-4"
                        ></v-text-field>

                        <!-- Password Field -->
                        <v-text-field
                            v-model="password"
                            label="Password"
                            type="password"
                            color="#FF42CD"
                            rounded="pill"
                            required
                            variant="outlined"
                            class="mb-4"
                        ></v-text-field>

                        <v-row justify="space-between" style="margin: 5px;">
                            <!-- Login Button -->
                            <v-btn color="#FF42CD" rounded flat height="50" width="120" @click="login">
                                Login
                            </v-btn>
                            <!-- Forgot Password Button -->
                            <v-btn color="#FF42CD" rounded flat height="50" width="200" variant="outlined" @click="forgotPassword">
                                Forgot Password
                            </v-btn>
                        </v-row>
                    <!-- Login Error Alert -->
                    <v-alert v-if="loginError" type="error" dismissible>
                        Incorrect username or password. Please try again.
                    </v-alert>
                    </v-form>
                </v-card-text>

            </v-col>

            <!-- Right Side (Image) -->
            <v-col cols="12" md="6" class="image-container">
                <img src="/images/balanced-diet.png" alt="E-Nutrition" class="centered-image" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const apiUrl = 'http://localhost:8055';
const authEndpoint = `${apiUrl}/auth/login`;

const email = ref('');
const password = ref('');
const router = useRouter();
const userRole = ref('');
const token = ref('');
const loginError = ref(false);

const login = async () => {
    try {
        const response = await axios.post(authEndpoint, {
            email: email.value,
            password: password.value,
        });
        //token.value = "ccU0aOKcdEV48Sk8JKwHxw2z9F8HUXvS";
        token.value = "VgVfwfMsYckOo7NME5VxpKFPcxf4mfm6";
        token.value = response.data.data.access_token;
        localStorage.setItem('auth-token', token.value);
        loginError.value = false;
        router.push('/admin/dashboard');
    } catch (error) {
        loginError.value = true;
        console.error('Login error:', error);
    }
};

onMounted(() => {
    localStorage.removeItem('auth-token');
});
</script>

<style scoped>
.login-container {
    height: 100vh;
    display: flex;
    margin: 0;
    padding: 0;
    background-color: #ffffff;
}

.form-container {
    display: flex;
    flex-direction: column;
    max-width: 550px;
    align-items: center;
    justify-content: center;
    background-color: #890661;
}

.form-card {
    width: 100%;
    max-width: 400px;
    color: #ffffff;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.centered-image {
    max-width: 100%;
    height: auto;
    margin-left: 500px;
}

.logo-section {
    margin-top: 20px;
    margin-left: 100px;
    width: 100%;
}

.logo-container {
    display: flex;
    justify-content: flex-start;
    max-width: 100px;
    background-color: white;
    border-radius: 10px;
}

.logo-image {
    height: 80px;
    width: 80px;
    margin-right: 10px;
    border-radius: 10px;
}

.text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.text-container h2 {
    margin: 0;
    font-size: 22px;
    color: white;
}

.text-container p {
    margin: 0;
    font-size: 16px;
    color: #FF42CD;
}
</style>