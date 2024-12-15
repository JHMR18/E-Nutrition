<template>
    <div class="container">
        <v-row class="mb-4" style="padding-top: 20px; padding-left: 20px;">
            <v-col cols="12">
                <v-text-field
                    v-model="searchQuery"
                    label="Search by First Name or Last Name"
                    width="500px"
                    clearable
                    variant="underlined"
                    @input="filterEnforcers"
                    base-color="#FF42CD"
                    color="#FF42CD"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-data-table
            :headers="headers"
            :items="filteredPatients"
            item-key="id"
            class="elevation-1"
        >
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn color="#FF42CD" @click="openEditModal(item)" small>Edit</v-btn>
                <v-btn color="error" @click="openDeleteConfirmation(item.id)" small>Delete</v-btn>
            </template>
        </v-data-table>
        <v-btn color="#FF42CD" @click="openAddUserModal">Add Account</v-btn>

        <!-- Add User Modal -->
        <v-dialog v-model="isAddUserModalOpen" max-width="600px">
            <v-card>
                <v-card-title class="text-h6" style="background-color: #FF42CD; color: white;">Add Patient Account</v-card-title>
                <v-card-text>
                    <v-form ref="addUser Form">
                        <v-text-field v-model="newUser .first_name" label="First Name" required></v-text-field>
                        <v-text-field v-model="newUser .last_name" label="Last Name" required></v-text-field>
                        <v-text-field v-model="newUser .email" label="Email" required></v-text-field>
                        <!-- <v-select
                            v-model="newUser .role"
                            :items="availableRoles"
                            item-title="name"
                            item-value="id"
                            label="Role"
                            required
                        ></v-select> -->
                        <v-text-field
                            v-model="newUser .password"
                            label="Password"
                            type="password"
                            required
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" @click="closeAddUserModal">Cancel</v-btn>
                    <v-btn color="#FF42CD" @click="addUser ">Add</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Edit Modal -->
        <v-dialog v-model="isEditModalOpen" max-width="600px">
            <v-card>
                <v-card-title class="text-h6" style="background-color: #FF42CD; color: white;">Edit Patient Account</v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field v-model="selectedPatient.first_name" label="First Name" required></v-text-field>
                        <v-text-field v-model="selectedPatient.last_name" label="Last Name" required></v-text-field>
                        <v-text-field v-model="selectedPatient.email" label="Email" required></v-text-field>
                        <!-- <v-select
                            v-model="selectedPatient.role"
                            :items="availableRoles"
                            item-title="name"
                            item-value="id"
                            label="Role"
                            required
                        ></v-select> -->
                        <v-text-field
                            v-model="newPassword"
                            label="New Password"
                            type="password"
                            hint="Leave empty to keep current password"
                            persistent-hint
                        ></v-text-field>
                        <v-text-field
                            v-model="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            :error-messages="passwordError"
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" @click="closeEditModal">Cancel</v-btn>
                    <v-btn color="#FF42CD" @click="savePatient" :disabled="!!passwordError">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Confirmation Modal -->
        <v-dialog v-model="isDeleteConfirmationOpen " max-width="400px">
            <v-card>
                <v-card-title class="text-h6" style="background-color: #FF42CD; color: white;">Confirm Deletion</v-card-title>
                <v-card-text>Are you sure you want to delete this acccount? This action cannot be undone</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" @click="closeDeleteConfirmation">Cancel</v-btn>
                    <v-btn color="error" @click="confirmDelete">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const token = localStorage.getItem("auth-token");
const patients = ref([]);
const roles = ref([]);
const isEditModalOpen = ref(false);
const isDeleteConfirmationOpen = ref(false);
const isAddUserModalOpen = ref(false);
const selectedPatient = ref({});
const PatientToDelete = ref(null);
const newUser  = ref({ first_name: '', last_name: '', email: '', role: 'fc53cc1a-206f-4b38-861f-a03a8e73088e', password: '' });
const newPassword = ref('');
const confirmPassword = ref('');
const searchQuery = ref('');

const PATIENT_ROLE_ID = 'fc53cc1a-206f-4b38-861f-a03a8e73088e';

const roleMapping = {
    [PATIENT_ROLE_ID]: 'Patient'
};

const api = axios.create({
    baseURL: 'http://localhost:8055',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

const headers = [
    { title: 'First Name', value: 'first_name' },
    { title: 'Last Name', value: 'last_name' },
    { title: 'Email', value: 'email' },
    { title: 'Role', value: 'displayRole' },
    { title: 'Actions', value: 'actions', sortable: false },
];

const passwordError = computed(() => {
    if (!newPassword.value && !confirmPassword.value) return '';
    if (newPassword.value && !confirmPassword.value) return 'Please confirm the password';
    if (newPassword.value !== confirmPassword.value) return 'Passwords do not match';
    if (newPassword.value && newPassword.value.length < 8) return 'Password must be at least 8 characters';
    return '';
});

const filteredPatients = computed(() => {
    return patients.value
        .filter(enforcer => enforcer.role === PATIENT_ROLE_ID)
        .filter(enforcer => {
            const fullName = `${enforcer.first_name} ${enforcer.last_name}`.toLowerCase();
            return fullName.includes(searchQuery.value.toLowerCase());
        })
        .map(enforcer => ({
            ...enforcer,
            displayRole: roleMapping[enforcer.role] || enforcer.role
        }));
});

const availableRoles = [
    { id: PATIENT_ROLE_ID, name: 'enforcer' }
];

onMounted(async () => {
    await fetchPatients();
});

const fetchPatients = async () => {
    try {
        const response = await api.get("/users", {
            params: {
                fields: ['id', 'first_name', 'last_name', 'email', 'role'],
                filter: {
                    role: {
                        _eq: PATIENT_ROLE_ID
                    }
                }
            }
        });
        patients.value = response.data.data;
    } catch (error) {
        console.error("Error fetching patients:", error.response?.data || error);
    }
};

const openEditModal = (enforcer) => {
    selectedPatient.value = { ...enforcer };
    newPassword.value = '';
    confirmPassword.value = '';
    isEditModalOpen.value = true;
};

const closeEditModal = () => {
    isEditModalOpen.value = false;
    selectedPatient.value = {};
    newPassword.value = '';
    confirmPassword.value = '';
};

const savePatient = async () => {
    try {
        const updateData = {
            first_name: selectedPatient.value.first_name,
            last_name: selectedPatient.value.last_name,
            email: selectedPatient.value.email,
            role: selectedPatient.value.role
        };

        if (newPassword.value) {
            updateData.password = newPassword.value;
        }

        await api.patch(`/users/${selectedPatient.value.id}`, updateData);
        await fetchPatients();
        closeEditModal();
    } catch (error) {
        console.error("Error saving patient:", error.response?.data || error);
    }
};

const openDeleteConfirmation = (id) => {
    PatientToDelete .value = id;
    isDeleteConfirmationOpen.value = true;
};

const closeDeleteConfirmation = () => {
    isDeleteConfirmationOpen.value = false;
    PatientToDelete.value = null;
};

const confirmDelete = async () => {
    try {
        await api.delete(`/users/${PatientToDelete.value}`);
        await fetchPatients();
        closeDeleteConfirmation();
    } catch (error) {
        console.error("Error deleting enforcer:", error.response?.data || error);
    }
};

const openAddUserModal = () => {
    isAddUserModalOpen.value = true;
};

const closeAddUserModal = () => {
    isAddUserModalOpen.value = false;
    newUser .value = { first_name: '', last_name: '', email: '', role: '', password: '' };
};

const addUser  = async () => {
    try {
        const { first_name, last_name, email, role, password } = newUser.value;
        await api.post("/users", {
            first_name,
            last_name,
            email,
            role,
            password
        });
        await fetchPatients();
        closeAddUserModal();
    } catch (error) {
        console.error("Error adding user:", error.response?.data || error);
    }
};
</script>

<style scoped>
.container {
    max-width: 1500px;
    margin: 40px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.mb-4 {
    margin-bottom: 1.5rem;
}

.text-h6 {
    font-size: 1.25rem;
    font-weight: bold;
}

.v-btn {
    transition: all 0.3s ease;
}

.v-btn:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.v-table {
    color: #FF42CD !important;

}
</style>