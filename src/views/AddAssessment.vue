    <template>
        <v-container max-width="1100" class="add-assessment-modal">
        <v-card class="shadow-2xl">
            <v-card-title class="text-white py-4 px-6 flex justify-between items-center" style="background-color:#FF42CD;">
            <span class="text-2xl font-bold">Add Health Assessment Record</span>
            </v-card-title>
            <v-card-text class="p-6">
                <v-row class="mb-4">
                <v-col cols="12">
                    <v-select
                        v-model="selectedUser"
                        :items="users"
                        item-title="full_name"
                        item-value="id"
                        label="Select User"
                        return-object
                        dense
                        outlined
                        style="color: #FF42CD;"
                        >
                        <template v-slot:selection="{ item }" >
                            <div class="d-flex align-center">
                            <div> {{ item.full_name }}</div>
                            </div>
                        </template>

                        <template v-slot:prepend-item>
                            <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="text-h6">Users</v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                        </template>
                        </v-select>
                </v-col>
            </v-row>

            <v-row class="mb-4">
                <v-col cols="12" md="6">
                <v-text-field label="First Name" v-model="newRecord.first_name" style="color: #FF42CD;"></v-text-field>
                <v-text-field label="Last Name" v-model="newRecord.last_name" style="color: #FF42CD;"></v-text-field>
                <v-text-field label="Email" v-model="newRecord.email" style="color: #FF42CD;"></v-text-field>
                <v-text-field type="date" label="Birth Date" v-model="newRecord.birth_date" style="color: #FF42CD;"></v-text-field>
                <v-text-field label="Age" v-model="newRecord.age" style="color: #FF42CD;"></v-text-field>
                <v-radio-group inline="true" style="color: #FF42CD;" v-model="newRecord.sex" label="Sex">
                    <v-radio label="Male" value="male"></v-radio>
                    <v-radio label="Female" value="female"></v-radio>
                </v-radio-group>
                <v-text-field label="Phone Number" v-model="newRecord.phone_number" style="color: #FF42CD;"></v-text-field>
                </v-col>
                
                <v-col cols="12" md="6">
                <v-text-field label="Address" v-model="newRecord.address" style="color: #FF42CD;"></v-text-field>
                <v-text-field label="Street Address" v-model="newRecord.street_address" style="color: #FF42CD;"></v-text-field>
                <v-autocomplete
                    label="Barangay"
                    v-model="newRecord.barangay"
                    :items="barangays"
                    style="color: #FF42CD;"
                ></v-autocomplete>
                <v-text-field label="City" v-model="newRecord.city" style="color: #FF42CD;"></v-text-field>
                <v-text-field label="Province" v-model="newRecord.province" style="color: #FF42CD;"></v-text-field>
                <v-text-field label="Zipcode" v-model="newRecord.zipcode" style="color: #FF42CD;"></v-text-field>
                </v-col>
            </v-row>
    
            <v-divider class="my-4 border-primary-200"></v-divider>
    
            <section class="mb-4">
                <h2 class="text-xl font-semibold mb-3 text-primary-600" style="color: #FF42CD;">Health History</h2>
                <v-row>
                <v-col cols="12" md="6">
                    <v-text-field label="Height (cm)" v-model="newRecord.height" style="color: #FF42CD;"></v-text-field>
                    <v-text-field label="Weight (kg)" v-model="newRecord.weight" style="color: #FF42CD;"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="bg-gray-50 p-4 rounded-lg">
                    <v-text-field type="date" label="Height Date Taken" v-model="newRecord.height_date_taken" style="color: #FF42CD;"></v-text-field>
                    <v-text-field type="date" label="Weight Date Taken" v-model="newRecord.weight_date_taken" style="color: #FF42CD;"></v-text-field>

                </v-col>
                </v-row>
            </section>
    
            <v-divider class="my-4 border-primary-200"></v-divider>
    
            <section class="mb-4">
        <h2 class="text-xl font-semibold mb-3 text-primary-600" style="color: #FF42CD;">Health Questionnaire</h2>
        <v-row>
          <v-col cols="12" md="6" class="bg-gray-50 p-4 rounded-lg">
            <v-radio-group style="color: #FF42CD;" v-model="newRecord.taking_meds" inline="true" label="Taking Medication?">
              <v-radio color="#FF42CD" label="Yes" value="yes"></v-radio>
              <v-radio color="#FF42CD" label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="newRecord.eating_problems" inline="true" label="Eating Problems in Last 3 Months?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="newRecord.reduced_weight" inline="true" label="Weight Reduction in Last 3 Months?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="newRecord.pooping_problems" inline="true" label="Experiencing Bowel Movement Difficulties?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="6" class="bg-gray-50 p-4 rounded-lg">
            <v-radio-group style="color: #FF42CD;" v-model="newRecord.is_pregnant" inline="true" label="Pregnant?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="newRecord.is_breast_feeding" inline="true" label="Breastfeeding?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="newRecord.is_smoking" inline="true" label="Smoking?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="newRecord.is_drinking" inline="true" label="Drinking Alcohol?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </section>

      <v-divider class="my-4 border-primary-200"></v-divider>
      
      <section class="mb-4">
  <h2 class="text-xl font-semibold mb-3 text-primary-600" style="color: #FF42CD;">Physical Activity</h2>
  <div class="bg-gray-50 p-4 rounded-lg">
    <v-table style="color: #FF42CD;">
      <thead>
        <tr>
          <th>Physical Activity Level</th>
          <th>Select</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Sedentary</td>
          <td>
            <v-checkbox v-model="newRecord.sedentary" label="Yes" value="yes" @click="clearOtherActivityLevels('sedentary')"></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Lightly Active</td>
          <td>
            <v-checkbox v-model="newRecord.lightly_active" label="Yes" value="yes" @click="clearOtherActivityLevels('lightly_active')"></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Moderately Active</td>
          <td>
            <v-checkbox v-model="newRecord.moderately_active" label="Yes" value="yes" @click="clearOtherActivityLevels('moderately_active')"></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Very Active</td>
          <td>
            <v-checkbox v-model="newRecord.very_active" label="Yes" value="yes" @click="clearOtherActivityLevels('very_active')"></v-checkbox>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</section>

      <v-divider class="my-4 border-primary-200"></v-divider>

      <section class="mb-4">
        <h2 class="text-xl font-semibold mb-3 text-primary-600" style="color: #FF42CD;">Diagnosis</h2>
        <div class="bg-gray-50 p-4 rounded-lg">
          <v-radio-group style="color: #FF42CD;" inline="true" v-model="newRecord.diagnosed_with_disease" label="Diagnosed with Acute/Chronic Disease?">
            <v-radio label="Yes" value="yes"></v-radio>
            <v-radio label="No" value="no"></v-radio>
          </v-radio-group>
          
          <v-select
            label="Medical Condition"
            v-model="newRecord.medical_condition"
            :items="medicalConditions"
            style="color: #FF42CD;"
            item-title="name"
            item-value="value"
          ></v-select>
          
          <!-- <v-text-field label="Lab Test Result" v-model="newRecord.lab_test_result" style="color: #FF42CD;"></v-text-field> -->
        </div>
      </section>

      <v-divider class="my-4 border-primary-200"></v-divider>

      <section>
                <h2 class="text-xl font-semibold mb-3 text-primary-600" style="color: #FF42CD;">Family Health History</h2>
                <v-table class="rounded-lg overflow-hidden">
                    <thead class="text-white" style="background-color:#FF42CD">
                        <tr>
                            <th>Relation</th>
                            <th>Age</th>
                            <th>In Good Health</th>
                            <th>Known Health Problems</th>
                            <th>Alive</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white text-pink" style="background-color:#FF42CD; color: #FF42CD;">
                        <tr v-for="(family, index) in newRecord.family_history" :key="index" class="hover:bg-gray-100">
                            <td style="color: #FF42CD;">{{ family.relation }}</td>
                            <td style="color: #FF42CD;">
                                <v-text-field v-model="newRecord.family_history[index].edad" style="color: #FF42CD;"></v-text-field>
                            </td>
                            <td style="color: #FF42CD;">
                                <v-radio-group inline="true" v-model="newRecord.family_history[index].in_good_health" style="color: #FF42CD;">
                                    <v-radio label="Yes" value="yes"></v-radio>
                                    <v-radio label="No" value="no"></v-radio>
                                </v-radio-group>
                            </td>
                            <td style="color: #FF42CD;">
                                <v-text-field v-model="newRecord.family_history[index].known_health_problems" style="color: #FF42CD;"></v-text-field>
                            </td>
                            <td style="color: #FF42CD;">
                                <v-radio-group inline="true" v-model="newRecord.family_history[index].alive" style="color: #FF42CD;">
                                    <v-radio label="Yes" value="yes"></v-radio>
                                    <v-radio label="No" value="no"></v-radio>
                                </v-radio-group>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </section>
      <v-divider class="my-4 border-primary-200"></v-divider>

      <section class="mb-4">
        <h2 class="text-xl font-semibold mb-3 text-primary-600" style="color: #FF42CD;">Reason for Consultation</h2>
        <div class="bg-gray-50 p-4 rounded-lg">
          <v-text-field label="Reason for Consultation" v-model="newRecord.reason_for_consultation" style="color: #FF42CD;"></v-text-field>
        </div>
      </section>

            </v-card-text>
            <v-card-actions style="position: fixed; bottom: 0; left: 0; right: 0; background-color: white;" class="bg-gray-100 py-4 px-6 rounded-b-xl">
            <v-spacer></v-spacer>

            <v-btn 
                color="#FF42CD" 
                variant="elevated" 
                class="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                @click="addAssessmentRecord"
            >
                Add Record
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-container>
    </template>
    
    <script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
const router = useRouter();
const showAddAssessmentModal = ref(true);
const users = ref([]);
const selectedUser = ref(null);
    const newRecord = ref({
        user_id: null, 
    first_name: '',
    last_name: '',
    email: '',
    birth_date: '',
    age: '',
    sex: '',
    phone_number: '',
    address: '',
    street_address: '',
    barangay: '',
    city: '',
    province: '',
    zipcode: '',
    height: '',
    weight: '',
    height_date_taken: '',
    weight_date_taken: '',
    taking_meds: '',
    eating_problems: '',
    reduced_weight: '',
    pooping_problems: '',
    is_pregnant: '',
    is_breast_feeding: '',
    is_smoking: '',
    is_drinking: '',
    sedentary: '',
    lightly_active: '',
    moderately_active: '',
    very_active: '',
    diagnosed_with_disease: '',
    medical_condition: '',
    reason_for_consultation: '',
    family_history: [
        { 
            relation: 'Father', 
            edad: '', 
            in_good_health: '', 
            known_health_problems: '', 
            alive: '' 
        },
        { 
            relation: 'Mother', 
            edad: '', 
            in_good_health: '', 
            known_health_problems: '', 
            alive: '' 
        },
        { 
            relation: 'Sibling 1', 
            edad: '', 
            in_good_health: '', 
            known_health_problems: '', 
            alive: '' 
        },
        { 
            relation: 'Sibling 2', 
            edad: '', 
            in_good_health: '', 
            known_health_problems: '', 
            alive: '' 
        }
    ]
});
    const medicalConditions = [
    { name: 'Arthritis', value: 'arthritis' },
        { name: 'Diabetes', value: 'diabetes' },
        { name: 'Hypertension', value: 'hypertension' },
        { name: 'Heart Disease', value: 'heart_disease' },
        { name: 'Cancer', value: 'cancer' },
        { name: 'High Cholesterol', value: 'high_cholesterol' },
        { name: 'High Triglycerides', value: 'high_triglycerides' },
        { name: 'Kidney disease', value: 'kidney_disease' },
        { name: 'Asthma', value: 'asthma' },
        { name: 'Fatty liver', value: 'fatty_liver' },
        { name: 'Chronic Obstructive Pulmonary Disease', value: 'copd' },
        { name: 'Tuberculosis', value: 'tuberculosis' },
        { name: 'Obesity', value: 'obesity' }
    ]
    const barangays = [
        "Alitao",
        "Angustias Zone I",
        "Angustias Zone II",
        "Angustias Zone III",
        "Angustias Zone IV",
        "Alupay",
        "Anos",
        "Bukal",
        "Caloocan",
        "Dapdap",
        "Gibanga",
        "Ipilan",
        "Ilasan Ilaya",
        "Ilasan Ibaba",
        "Isabang",
        "Kalumpang",
        "Katigan Kanluran",
        "Katigan Silangan",
        "Lakawan",
        "Lawigue",
        "Lita",
        "Mateuna",
        "Mabini",
        "Masin Norte",
        "Masin Sur",
        "Monte Alegre",
        "Opias",
        "Palale Ilaya",
        "Palale Ibaba",
        "San Diego Zone I",
        "San Diego Zone II",
        "San Isidro Zone I",
        "San Isidro Zone II",
        "San Roque Zone I",
        "San Roque Zone II",
        "Tagbakin",
        "Talolong"
    ];
    
    const clearOtherActivityLevels = (currentLevel) => {
    const activityLevels = ['sedentary', 'lightly_active', 'moderately_active', 'very_active'];
    activityLevels.forEach(level => {
        if (level !== currentLevel) {
            newRecord.value[level] = '';
        }
    });
};
const closeAddAssessmentModal = () => {
    showAddAssessmentModal.value = false;
    // Reset the entire newRecord to its initial state
    newRecord.value = {
        first_name: '',
        last_name: '',
        email: '',
        birth_date: '',
        age: '',
        sex: '',
        phone_number: '',
        address: '',
        street_address: '',
        barangay: '',
        city: '',
        province: '',
        zipcode: '',
        height: '',
        weight: '',
        height_date_taken: '',
        weight_date_taken: '',
        taking_meds: '',
        eating_problems: '',
        reduced_weight: '',
        pooping_problems: '',
        is_pregnant: '',
        is_breast_feeding: '',
        is_smoking: '',
        is_drinking: '',
        sedentary: '',
        lightly_active: '',
        moderately_active: '',
        very_active: '',
        diagnosed_with_disease: '',
        medical_condition: '',
        reason_for_consultation: '',
        family_history: [
            { 
                relation: 'Father', 
                edad: '', 
                in_good_health: '', 
                known_health_problems: '', 
                alive: '' 
            },
            { 
                relation: 'Mother', 
                edad: '', 
                in_good_health: '', 
                known_health_problems: '', 
                alive: '' 
            },
            { 
                relation: 'Sibling 1', 
                edad: '', 
                in_good_health: '', 
                known_health_problems: '', 
                alive: '' 
            },
            { 
                relation: 'Sibling 2', 
                edad: '', 
                in_good_health: '', 
                known_health_problems: '', 
                alive: '' 
            }
        ]
    };
};
const fetchUsers = async () => {
    const token = localStorage.getItem('auth-token');
    try {
        const response = await axios.get('http://localhost:8055/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Preserve original user data and add full_name for display
        users.value = response.data.data.map(user => ({
            ...user,  // Spread the original user object
            full_name: `${user.first_name} ${user.last_name}`,
            subtitle: user.email
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
// Watch for user selection and update user_id
const watchUserSelection = () => {
    watch(selectedUser, (newValue) => {
        if (newValue) {
            newRecord.value.user_id = newValue.id;
            
            // Use the selected user's data directly
            newRecord.value.first_name = newValue.first_name || '';
            newRecord.value.last_name = newValue.last_name || '';
            newRecord.value.email = newValue.email || '';
        }
    });
};
watch(() => newRecord.value.birth_date, (newBirthDate) => {
    if (newBirthDate) {
        const birthDate = new Date(newBirthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        
        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        newRecord.value.age = age; // Update the age field
    } else {
        newRecord.value.age = ''; // Reset age if no birth date is selected
    }
});
const addAssessmentRecord = async () => {
        const token = localStorage.getItem('auth-token');
        try {
        const response = await axios.post('http://localhost:8055/items/health_assessnent', newRecord.value, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Record added successfully:', response.data);
        closeAddAssessmentModal();
        router.push('/admin/patient-records');

        } catch (error) {
        console.error('Error adding record:', error);
        }
    };

    onMounted(() => {
    fetchUsers();
    watchUserSelection();
});
    </script>
    
    <style scoped>

    </style>
