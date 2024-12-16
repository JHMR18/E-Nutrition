<template>
  <div class="container">
    <v-row class="barangay-search-row" align="center" justify="center">
  <v-col cols="6" sm="4">
    <v-select
      v-model="barangayFilter"
      :items="barangayFilterOptions"
      label="Select Barangay"
      placeholder="All Barangays"
      base-color="#FF42CD"
      variant="underlined"
      color="#FF42CD"
    ></v-select>
  </v-col>
  <v-col cols="6" sm="4">
    <v-text-field
      v-model="searchQuery"
      label="Search by email or first name"
      placeholder="Search"
      base-color="#FF42CD"
        prepend-icon="mdi-magnify"
      variant="underlined"
      color="#FF42CD"
    ></v-text-field>
  </v-col>
  <v-btn color="#FF42CD" text to="/admin/add-assessment" class="white--text">
      <v-icon left>mdi-plus-box</v-icon>
      Add Assessment Record
  </v-btn>
</v-row>
    <div class="cards-container">
      <div v-for="record in filteredRecords" :key="record.id" class="card relative">
        <div class="chips absolute top-2 right-2 flex gap-1">
          <v-chip 
            v-for="chip in getPatientChips(record)" 
            :key="chip" 
            :color="getChipColor(chip)"
            size="small"
            class="text-xs"
          >
            {{ chip }}  
          </v-chip>
          <!-- New chip for date created -->
          <v-chip 
          style="position: absolute; top: 0; right: 0; margin-top: 20px; margin-right: 10px;"
            color="blue" 
            size="small"
            class="text-xs"
          >
            {{ formatDateCreated(record.date_created) }}
          </v-chip>
        </div>

        <div class="card-content">
          <h2 style="padding-top: 10px;">{{ record.first_name }} {{ record.last_name }}</h2>
          <p>{{ record.email }}</p>
          <p>{{ record.barangay }}</p>
          <p>{{ record.phone_number }}</p>
          <p>BMI: {{ calculateBMI(record) }}</p>
        </div>

        <v-row justify="center"> 
          <div 
            class="health-assessment-icon absolute top-2 right-12 cursor-pointer hover:scale-110 transition-transform"
            @click="showModal(record)"
          >
            <v-icon color="#FF42CD" size="large">mdi-medical-bag</v-icon>
            <span class="text-xs text-gray-600 block text-center">Health Assessment</span>
          </div>
          <div 
            class="health-assessment-icon absolute top-2 right-12 cursor-pointer hover:scale-110 transition-transform"
            @click="record.diagnosed_with_disease === 'yes' ? showSendMessageModal(record) : showMealPlan(record)"
          >
            <v-icon v-if="record.diagnosed_with_disease === 'yes'" color="#FF42CD" size="large">mdi-message</v-icon>
            <v-icon v-else color="#FF42CD" size="large">mdi-food-variant</v-icon>
            <span v-if="record.diagnosed_with_disease === 'yes'" class="text-xs text-gray-600 block text-center">Send Message</span>
            <span v-else class="text-xs text-gray-600 block text-center">View Meal Plans</span>
          </div>
        </v-row>
        </div>
      </div>
      
<!-- Send message modal -->
<v-dialog v-model="showSendMessageModalComponent" max-width="800" class="send-message-modal">
  <v-card class="shadow-2xl">
    <v-card-title class="text-white py-4 px-6 flex justify-between items-center" style="background-color:#FF42CD; position: fixed; top: 0; left: 0; right: 0;z-index: 1 ;">
      <span class="text-2xl font-bold">Send Message to {{ selectedPatientForMessage.first_name }} {{ selectedPatientForMessage.last_name }} </span>
    </v-card-title>
    <v-card-text class="p-6 mt-16 overflow-y-auto" >
      <v-textarea
        v-model="message"
        label="Message"
        placeholder="Type your message here..."
        auto-grow="true"
        focused="true"
        style="color: #FF42CD;"
      ></v-textarea>
    </v-card-text>
    <v-card-actions style="position: fixed; bottom: 0; left: 0; right: 0; background-color: white;" class="bg-gray-100 py-4 px-6 rounded-b-xl">
      <v-spacer></v-spacer>
      <v-btn 
        color="#FF42CD" 
        variant="elevated" 
        class="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
        @click="closeSendMessageModal"
      >
        Cancel
      </v-btn>
      <v-btn 
        color="#FF42CD" 
        variant="elevated" 
        class="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
        @click="sendMessage"
      >
        Send
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


      <v-dialog v-model="showModalComponent" max-width="1100" class="health-assessment-modal">
  <v-card class="shadow-2xl">
    <v-card-title class="text-white py-4 px-6  flex justify-between items-center" style="background-color:#FF42CD; position: fixed; top: 0; left: 0; right: 0;z-index: 1 ;">
      <v-row>
        <span style="margin-right: 20px;" class="text-2xl font-bold">Health Assessment</span>
        <div class="flex gap-2">
          <v-chip 
            v-for="chip in getPatientChips(selectedRecord)" 
            :key="chip" 
            style="background-color: white !important; margin-right: 10px;"
            :color="getChipColor(chip)"
            size="small"
            class="text-xs"
          >
            {{ chip }} 
          </v-chip>
        </div>
      </v-row>
    </v-card-title>
    <v-card-text class="p-6">
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium mb-3 text-primary-600" style="color: #FF42CD;">Personal Information</h3>
            <div class="grid grid-cols-2 gap-2">
              <v-text-field label="First Name" v-model="selectedRecord.first_name" style="color: #FF42CD;"></v-text-field>
              <v-text-field label="Last Name" v-model="selectedRecord.last_name" style="color: #FF42CD;"></v-text-field>
              <v-text-field label="Email" v-model="selectedRecord.email" style="color: #FF42CD;"></v-text-field>
              <v-text-field label="Birth Date" v-model="selectedRecord.birth_date" style="color: #FF42CD;"></v-text-field>
              <v-text-field label="Age" v-model="selectedRecord.age" style="color: #FF42CD;"></v-text-field>
              <v-radio-group style="color: #FF42CD;" inline="true" v-model="selectedRecord.sex" label="Sex">
              <v-radio   label="Male" value="male"></v-radio>
              <v-radio label="Female" value="female"></v-radio>
            </v-radio-group>
              <v-text-field label="Phone Number" v-model="selectedRecord.phone_number" style="color: #FF42CD;"></v-text-field>
            </div>
          </div>
        </v-col>
        
        <v-col cols="12" md="6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium mb-3 text-primary-600" style="color: #FF42CD;">Contact Address</h3>
            <div class="grid grid-cols-2 gap-2">
              <v-text-field label="Address" v-model="selectedRecord.address" style="color: #FF42CD;"></v-text-field>
              <v-text-field label="Street Address" v-model="selectedRecord.street_address" style="color: #FF42CD;"></v-text-field>
              <v-autocomplete
                label="Barangay"
                v-model="selectedRecord.barangay"
                :items="barangays"
                style="color: #FF42CD;"
              ></v-autocomplete>
              <v-text-field label="City" v-model="selectedRecord.city" style="color: #FF42CD;"></v-text-field>
              <v-text-field label="Province" v-model="selectedRecord.province" style="color: #FF42CD;"></v-text-field>
              <v-text-field label="Zipcode" v-model="selectedRecord.zipcode" style="color: #FF42CD;"></v-text-field>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4 border-primary-200"></v-divider>

      <section class="mb-4">
        <h2 class="text-xl font-semibold mb-3 text-primary-600" style="color: #FF42CD;">Health History</h2>
        <v-row>
          <v-col cols="12" md="6" class="bg-gray-50 p-4 rounded-lg">
            <v-text-field label="Height (cm)" v-model="selectedRecord.height" style="color: #FF42CD;"></v-text-field>
            <v-text-field label="Height Date Taken" v-model="selectedRecord.height_date_taken" style="color: #FF42CD;"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="bg-gray-50 p-4 rounded-lg">
            <v-text-field label="Weight ( kg)" v-model="selectedRecord.weight" style="color: #FF42CD;"></v-text-field>
            <v-text-field label="Weight Date Taken" v-model="selectedRecord.weight_date_taken" style="color: #FF42CD;"></v-text-field>
          </v-col>
        </v-row>
      </section>

      <v-divider class="my-4 border-primary-200"></v-divider>

      <section class="mb-4">
        <h2 class="text-xl font-semibold mb-3 text-primary-600" style="color: #FF42CD;">Health Questionnaire</h2>
        <v-row>
          <v-col cols="12" md="6" class="bg-gray-50 p-4 rounded-lg">
            <v-radio-group style="color: #FF42CD;" v-model="selectedRecord.taking_meds" inline="true" label="Taking Medication?">
              <v-radio color="#FF42CD" label="Yes" value="yes"></v-radio>
              <v-radio color="#FF42CD" label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="selectedRecord.eating_problems" inline="true" label="Eating Problems in Last 3 Months?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="selectedRecord.reduced_weight" inline="true" label="Weight Reduction in Last 3 Months?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="selectedRecord.pooping_problems" inline="true" label="Experiencing Bowel Movement Difficulties?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="6" class="bg-gray-50 p-4 rounded-lg">
            <v-radio-group style="color: #FF42CD;" v-model="selectedRecord.is_pregnant" inline="true" label="Pregnant?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="selectedRecord.is_breast_feeding" inline="true" label="Breastfeeding?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="selectedRecord.is_smoking" inline="true" label="Smoking?">
              <v-radio label="Yes" value="yes"></v-radio>
              <v-radio label="No" value="no"></v-radio>
            </v-radio-group>
            <v-radio-group style="color: #FF42CD;" v-model="selectedRecord.is_drinking" inline="true" label="Drinking Alcohol?">
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
            <v-checkbox v-model="selectedRecord.sedentary" label="Yes" value="yes" @click="clearOtherActivityLevels('sedentary')"></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Lightly Active</td>
          <td>
            <v-checkbox v-model="selectedRecord.lightly_active" label="Yes" value="yes" @click="clearOtherActivityLevels('lightly_active')"></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Moderately Active</td>
          <td>
            <v-checkbox v-model="selectedRecord.moderately_active" label="Yes" value="yes" @click="clearOtherActivityLevels('moderately_active')"></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Very Active</td>
          <td>
            <v-checkbox v-model="selectedRecord.very_active" label="Yes" value="yes" @click="clearOtherActivityLevels('very_active')"></v-checkbox>
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
          <v-radio-group style="color: #FF42CD;" inline="true" v-model="selectedRecord.diagnosed_with_disease" label="Diagnosed with Acute/Chronic Disease?">
            <v-radio label="Yes" value="yes"></v-radio>
            <v-radio label="No" value="no"></v-radio>
          </v-radio-group>
          <v-text-field label="Medical Condition" v-model="selectedRecord.medical_condition" style="color: #FF42CD;"></v-text-field>
          <!-- <v-text-field label="Lab Test Result" v-model="selectedRecord.lab_test_result" style="color: #FF42CD;"></v-text-field> -->
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
      <tr v-for="(family, index) in selectedRecord.family_history" :key="family.relation" class="hover:bg-gray-100">
        <td style="color: #FF42CD;">{{ family.relation }}</td>
        <td style="color: #FF42CD;">
          <v-text-field v-model="selectedRecord.family_history[index].edad" style="color: #FF42CD;"></v-text-field>
        </td>
        <td style="color: #FF42CD;">
          <v-radio-group inline="true" v-model="selectedRecord.family_history[index].in_good_health" style="color: #FF42CD;">
            <v-radio label="Yes" value="yes"></v-radio>
            <v-radio label="No" value="no"></v-radio>
          </v-radio-group>
        </td>
        <td style="color: #FF42CD;">
          <v-text-field v-model="selectedRecord.family_history[index].known_health_problems" style="color: #FF42CD;"></v-text-field>
        </td>
        <td style="color: #FF42CD;">
          <v-radio-group inline="true"  v-model="selectedRecord.family_history[index].alive" style="color: #FF42CD;">
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
          <v-text-field label="Reason for Consultation" v-model="selectedRecord.reason_for_consultation" style="color: #FF42CD;"></v-text-field>
        </div>
      </section>
    </v-card-text>

    <v-card-actions style="position: fixed; bottom: 0; left: 0; right: 0; background-color: white;" class="bg-gray-100 py-4 px-6 rounded-b-xl">
  <v-btn 
    color="red" 
    variant="elevated" 
    class="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all mr-auto"
    @click="confirmDeleteRecord"
  >
    <v-icon left>mdi-delete</v-icon>
    Delete Record
  </v-btn>
  <v-spacer></v-spacer>
  <v-btn 
    color="#FF42CD" 
    variant="elevated" 
    class="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
    @click="closeModal"
  >
    Close
  </v-btn>
  <v-btn 
    color="#FF42CD" 
    variant="elevated" 
    class="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
    @click="updateRecord"
  >
    Save Changes
  </v-btn>
</v-card-actions>
  </v-card>
</v-dialog>
<!-- Confirmation Dialog for Record Deletion -->
<v-dialog v-model="showDeleteConfirmationModal" max-width="500">
  <v-card>
    <v-card-title class="text-h5 text-red">
      Confirm Deletion
    </v-card-title>
    <v-card-text>
      Are you sure you want to delete this health assessment record for 
      <strong>{{ selectedRecord.first_name }} {{ selectedRecord.last_name }}</strong>? 
      This action cannot be undone.
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn 
        color="gray" 
        variant="text"
        @click="showDeleteConfirmationModal = false"
      >
        Cancel
      </v-btn>
      <v-btn 
        color="red" 
        variant="elevated"
        @click="deleteRecord"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
<!-- meal plan modal-->
<v-dialog v-model="showMealPlanModal" max-width="1100" height="700" class="meal-plan-modal">
  <v-card class="shadow-2xl">
    <v-card-title class="text-white py-4 px-6 flex justify-between items-center" style="background-color:#FF42CD; position: fixed; top: 0; left: 0; right: 0;z-index: 1;">
      <span class="text-2xl font-bold">{{ mealplan }} for {{ selectedRecordForMessage.first_name }} {{ selectedRecordForMessage.last_name }}</span>
    </v-card-title>
    <v-card-text class="p-6 mt-16 overflow-y-auto" style="max-height: 600px;">
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="mb-4">
            <v-card-title class="text-white py-4 px-6" style="background-color:#FF42CD;">
              Go Foods
            </v-card-title>
            <v-card-text>
              <v-table style="color: #FF42CD;">

                <tbody>
                  <tr v-for="item in mealPlanData.filter(item => item.category === 'Go')" :key="item.id">
                    <td>{{ item.food_item }}</td>
                    <td>{{ item.serving }}</td>
                  </tr>
                </tbody>
              </v-table>
              <!-- <p>Calories: {{ mealPlanData?.filter(item => item.category === 'Go')?.[0]?.calories }}</p> -->
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="mb-4">
            <v-card-title class="text-white py-4 px-6" style="background-color:#FF42CD;">
              Grow Foods
            </v-card-title>
            <v-card-text>
              <v-table style="color: #FF42CD;">

                <tbody>
                  <tr v-for="item in mealPlanData.filter(item => item.category === 'Grow')" :key="item.id">
                    <td>{{ item.food_item }}</td>
                    <td>{{ item.serving }}</td>
                  </tr>
                </tbody>
              </v-table>
              <!-- <p>Calories: {{ mealPlanData.filter(item => item.category === 'Grow')[0].calories }}</p> -->
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="mb-4">
            <v-card-title class="text-white py-4 px-6" style="background-color:#FF42CD;">
              Glow Foods
            </v-card-title>
            <v-card-text>
              <v-table style="color: #FF42CD;">

                <tbody>
                  <tr v-for="item in mealPlanData.filter(item => item.category === 'Glow')" :key="item.id">
                    <td>{{ item.food_item }}</td>
                    <td>{{ item.serving }}</td>
                  </tr>
                </tbody>
              </v-table>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions style="position: fixed; bottom: 0; left: 0; right: 0; background-color: white;" class="bg-gray-100 py-4 px-6 rounded-b-xl">
      <v-spacer></v-spacer>
      <v-btn
        color="#FF42CD"
        variant="elevated"
        class="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
        @click="closeMealPlanModal"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import axios from 'axios';
  
  const record = ref([]);
  const token = localStorage.getItem('auth-token');
  const searchQuery = ref('');
  const showModalComponent = ref(false);
  const selectedRecord = ref({});
  const barangayFilter = ref('All Barangays'); 

  const fetchPatientRecords = async () => {
    try {
      const response = await axios.get('http://localhost:8055/items/health_assessnent', {
        headers: { Authorization: `Bearer ${token}` }
      });
      record.value = response.data.data;
    } catch (error) {
      console.error('Error fetching patient records:', error);
    }
  };
  
  const calculateBMI = (record) => {
  const heightInMeters = record.height / 100;
  const weight = record.weight;

  if (heightInMeters > 0 && weight > 0) {
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
  }
  return null;
};
  
  const getPatientChips = (record) => {
    const chips = [];
    const bmi = calculateBMI(record);
  
    if (record.is_pregnant === 'yes') {
      chips.push('Pregnant'); 
    }
  
    if (bmi !== null) {
      if (bmi < 18.5) {
        chips.push('Underweight');
      } else if (bmi >= 30) {
        chips.push('Obese');
      }
    }
  
    if (
      record.diagnosed_with_disease === 'no' && 
      (record.medical_condition === 'none' || !record.medical_condition) &&
      (bmi === null || (bmi >= 18.5 && bmi < 30))
    ) {
      chips.push('Healthy');
    }
  
    if (
      record.diagnosed_with_disease === 'yes' && 
      (record.medical_condition)
    ) {
      chips.push('Diagnosed');
    }
  
    if (record.age >= 60) {
      chips.push('Elderly');
    }
    return chips;
  };
  const formatDateCreated = (dateString) => {
  if (!dateString) return 'No Date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
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
const barangayFilterOptions = [
  'All Barangays', 
  ...barangays
];
  const getChipColor = (chip) => {
    switch(chip) {
      case 'Healthy': return 'green';
      case 'Obese': return 'red';
      case 'Underweight': return 'orange';
      case 'Pregnant': return 'pink';
      case 'Diagnosed': return 'red';
      case 'Elderly': return 'green';
      default: return 'default';
    }
  };
  const clearOtherActivityLevels = (level) => {
  if (level === 'sedentary') {
    selectedRecord.value.lightly_active = 'no';
    selectedRecord.value.moderately_active = 'no';
    selectedRecord.value.very_active = 'no';
    selectedRecord.value.sedentary = 'yes';
  } else if (level === 'lightly_active') {
    selectedRecord.value.sedentary = 'no';
    selectedRecord.value.moderately_active = 'no';
    selectedRecord.value.very_active = 'no';
    selectedRecord.value.lightly_active = 'yes';
  } else if (level === 'moderately_active') {
    selectedRecord.value.sedentary = 'no';
    selectedRecord.value.lightly_active = 'no';
    selectedRecord.value.very_active = 'no';
    selectedRecord.value.moderately_active = 'yes';
  } else if (level === 'very_active') {
    selectedRecord.value.sedentary = 'no';
    selectedRecord.value.lightly_active = 'no';
    selectedRecord.value.moderately_active = 'no';
    selectedRecord.value.very_active = 'yes';
  }
}
const filteredRecords = computed(() => {
  return record.value.filter(record => {
    const matchesSearchQuery = record.first_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                               record.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesBarangay = barangayFilter.value === 'All Barangays' || record.barangay === barangayFilter.value;
    return matchesSearchQuery && matchesBarangay;
  });
});

  const showModal = (record) => {
    console.log('Show modal called with record:', record);
    selectedRecord.value = record;
    showModalComponent.value = true;
    console.log('Modal component state:', showModalComponent.value);
  };
  
  const closeModal = () => {
    showModalComponent.value = false;
  };
  
  const updateRecord = async () => {
    try {
      const response = await axios.patch(`http://localhost:8055/items/health_assessnent/${selectedRecord.value.id}`, selectedRecord.value, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Record updated successfully:', response.data);
      fetchPatientRecords();
      closeModal();
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };
  //meal plan code 
  // Add these new ref variables
const showMealPlanModal = ref(false);
const mealPlanData = ref([]);
let mealplan = ref();
// New function to fetch meal plans
const fetchMealPlans = async (record) => {
  try {
    // Determine the appropriate meal plan collection based on age and sex
    let collection = 'adults_meal_plan';
    let ageGroup = '';
    let sex = record.sex;

    // Pregnant meal plan takes precedence
    if (record.is_pregnant === 'yes') {
      collection = 'pregnant_meal_plan';
      const response = await axios.get(`http://localhost:8055/items/${collection}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      mealPlanData.value = response.data.data;
      mealplan = 'Pregnancy Meal Plan'
      showMealPlanModal.value = true;
      return;
    }

    // Determine collection and age group based on age
    if (record.age < 13) {
      collection = 'kids_meal_plan';
      ageGroup = '0-12';
      mealplan = 'Kids Meal Plan';
    } else if (record.age >= 13 && record.age < 19) {
      collection = 'teens_meal_plan';
      ageGroup = '13-18';
      mealplan = 'Teens Meal Plan';
    } else if (record.age >= 19 && record.age < 60) {
      collection = 'adults_meal_plan';
      ageGroup = '19-59';
      mealplan = 'Adults Meal Plan';
    } else {
      collection = 'elderly_meal_plan';
      ageGroup = '60';
      mealplan = 'Elderly Meal Plan';
    }

    // Fetch meal plans
    const response = await axios.get(`http://localhost:8055/items/${collection}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Filter meal plans based on age group and sex
    const filteredMealPlans = response.data.data.filter(item => 
      (!item.age_group || item.age_group.trim() === ageGroup) && 
      (!item.sex || item.sex.trim().toLowerCase() === sex.toLowerCase())
    );

    // Explicitly set mealPlanData
    mealPlanData.value = filteredMealPlans;
    
    // Always show modal, even if no meal plans found
    showMealPlanModal.value = true;

    // Log for debugging
    console.log('Filtered Meal Plans:', filteredMealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    mealPlanData.value = []; // Ensure data is cleared
    showMealPlanModal.value = true;
  }
};

const showSendMessageModalComponent = ref(false);
const   selectedPatientForMessage = ref(null)
const selectedRecordForMessage = ref(null);
const message = ref('');
// Modify the existing showModal function to include meal plan button
const showMealPlan = (record) => {
  fetchMealPlans(record);
  selectedRecordForMessage.value = record
  showMealPlanModal.value = true
};


const showSendMessageModal = (record) => {
      selectedPatientForMessage.value = record
      console.log('Selected patient for message:', selectedPatientForMessage.value.first_name);
      showSendMessageModalComponent.value = true
    }
const closeSendMessageModal = () => {
      showSendMessageModalComponent.value = false
      message.value = ''
}
const closeMealPlanModal = () => {
  
  showMealPlanModal.value = false;
  mealPlanData.value = [];
  mealplan.value = '';

};

const showDeleteConfirmationModal = ref(false);

const confirmDeleteRecord = () => {
  showDeleteConfirmationModal.value = true;
};

const deleteRecord = async () => {
  try {
    // Close the confirmation modal
    showDeleteConfirmationModal.value = false;
    
    // Close the health assessment modal
    showModalComponent.value = false;
    
    // Send delete request to the server
    await axios.delete(`http://localhost:8055/items/health_assessnent/${selectedRecord.value.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    

    await fetchPatientRecords();
    console.log('Record deleted successfully');
  } catch (error) {
    console.error('Error deleting record:', error);
  }
};
  onMounted(() => {
    fetchPatientRecords();
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 1800px;
    margin: 40px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .search-bar {
    margin-bottom: 20px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .cards-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .card {
  margin: 20px;
  padding: 20px;
  width: 450px; 
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
}
  
  .card h2 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #FF42CD;
  }
  
  .card p {
    font-size: 16px;
    color: #666;
  }

  .modal-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-title {
  background-color: #FF42CD;
  color: white;
  padding: 16px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.modal-content {
  padding: 20px;
}
.health-assessment-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  justify-content: center;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.health-assessment-icon:hover {
  background-color: rgba(255, 66, 205, 0.1);
}
.barangay-filter {
  margin-bottom: 20px;
}

.barangay-filter select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
  </style>