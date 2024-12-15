<template>
    <v-app>
        <!-- Top App Bar -->
        <v-app-bar color="#FF42CD" dark app>
            <!-- Left Side: App Name -->
            <v-toolbar-title class="white--text text-h5 ">E-Nutrition</v-toolbar-title>

            <!-- Center: Navigation Options -->
            <v-spacer></v-spacer>
            <v-btn text to="/admin/dashboard" class="white--text">
                <v-icon left>mdi-view-dashboard</v-icon>
                Dashboard
            </v-btn>
            <v-btn text to="/admin/patient-records" class="white--text">
                <v-icon left>mdi-account-multiple-outline</v-icon>
                Patient Records
            </v-btn>
                        <v-btn text to="/admin/users" class="white--text">
                <v-icon left>mdi-account</v-icon>
                Patient Accounts
            </v-btn>
            <v-btn text to="/admin/reports" class="white--text">
                <v-icon left>mdi-chart-bar</v-icon>
                Reports
            </v-btn>

            <v-spacer></v-spacer>

            <!-- Right Side: User Info -->
            <div class="user-info mr-4">
                <p class="user-name">{{ firstName }} {{ lastName }}</p>
                <p class="user-role">{{ role }}</p>
            </div>
            <v-avatar size="40" class="mr-2">
                <v-img :src="userAvatar" alt="User Avatar"></v-img>
            </v-avatar>
            
            <!-- Logout Button -->
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                        icon 
                        v-bind="attrs"
                        v-on="on"
                        @click="confirmLogout"
                    >
                        <v-icon color="white">mdi-logout</v-icon>
                    </v-btn>
                </template>
                <span>Logout</span>
            </v-tooltip>
        </v-app-bar>
        <v-main>
            <RouterView />
                    <!-- Logout Confirmation Dialog -->
        <v-dialog v-model="logoutDialog" max-width="290">
            <v-card>
                <v-card-title class="headline">Confirm Logout</v-card-title>
                <v-card-text>
                    Are you sure you want to log out?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="logoutDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="red darken-1" text @click="logout">
                        Logout
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> 
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, RouterView } from 'vue-router';

const apiUrl = 'http://localhost:8055';
const token = localStorage.getItem('auth-token');

const firstName = ref('');
const lastName = ref('');
const role = ref('');
const userAvatar = ref('');
const router = useRouter();

// Logout dialog state
const logoutDialog = ref(false);

// Fetch user details from Directus
const fetchUser = async () => {
    try {
        const response = await axios.get(`${apiUrl}/users/me?fields=first_name,last_name,role.name,avatar`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Set user info
        firstName.value = response.data.data.first_name;
        lastName.value = response.data.data.last_name;
        role.value = response.data.data.role.name;

        // Set avatar
        if (response.data.data.avatar) {
            userAvatar.value = `${apiUrl}/assets/${response.data.data.avatar}`;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

// Show logout confirmation dialog
const confirmLogout = () => {
    logoutDialog.value = true;
};

// Logout method
const logout = () => {
    // Clear local storage
    localStorage.removeItem('auth-token');
    
    // Close the dialog
    logoutDialog.value = false;
    
    // Redirect to login page
    router.push('/');
};

onMounted(() => {
    fetchUser();
});
</script>

<style scoped>
.user-info {
    text-align: right;
}

.user-name {
    margin: 0;
    font-weight: bold;
    color: white;
}

.user-role {
    margin: 0;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.7);
}
</style>