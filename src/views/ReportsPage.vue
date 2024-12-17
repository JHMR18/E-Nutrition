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
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <h2>BMI Category Report</h2>
          <v-table>
            <thead>
              <tr>
                <th style="font-weight: bold; color: #FF42CD;">BMI Category</th>
                <th style="font-weight: bold; color: #FF42CD;">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in bmiCategories" :key="category.name" @click="showBMIDetails(category.name)">
                <td style="color: #FF42CD; cursor: pointer;">{{ category.name }}</td>
                <td style="color: #FF42CD; cursor: pointer;">{{ category.percentage }}%</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
        <v-col cols="12" md="6">
          <h2>Health Issues Report</h2>
          <v-table>
            <thead>
              <tr>
                <th style="font-weight: bold; color: #FF42CD;">Health Issues</th>
                <th style="font-weight: bold; color: #FF42CD;">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="issue in healthIssues" :key="issue.name" @click="showHealthIssueDetails(issue.name)">
                <td style="color: #FF42CD; cursor: pointer;">{{ issue.name }}</td>
                <td style="color: #FF42CD; cursor: pointer;">{{ issue.percentage }}%</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <v-dialog v-model="showBMIDialog" max-width="800">
        <v-card>
          <v-card-title style="background-color: #FF42CD; color: white;">BMI Category Details</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>Height</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="patient in bmiPatients" :key="patient.id">
                  <td>{{ patient.first_name }} {{ patient.last_name }}</td>
                  <td>{{ patient.age }}</td>
                  <td>{{ patient.sex }}</td>
                  <td>{{ patient.height }}</td>
                  <td>{{ patient.weight }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#FF42CD" @click="showBMIDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showHealthIssueDialog" max-width="800">
        <v-card>
          <v-card-title style="background-color: #FF42CD; color: white;">Health Issue Details</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>Medical Condition</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="patient in healthIssuePatients" :key="patient.id">
                  <td>{{ patient.first_name }} {{ patient.last_name }}</td>
                  <td>{{ patient.age }}</td>
                  <td>{{ patient.sex }}</td>
                  <td>{{ patient.medical_condition }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#FF42CD" @click="showHealthIssueDialog = false">Close</ v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import axios from 'axios';
  
  const record = ref([]);
  const token = localStorage.getItem('auth-token');
  const searchQuery = ref('');
  const barangayFilter = ref('All Barangays');
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
  
  const showBMIDialog = ref(false);
  const showHealthIssueDialog = ref(false);
  const bmiPatients = ref([]);
  const healthIssuePatients = ref([]);
  
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
  
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) {
      return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      return 'Normal';
    } else if (bmi >= 25 && bmi < 30) {
      return 'Overweight';
    } else {
      return 'Obese';
    }
  };
  
  const bmiCategories = computed(() => {
    const categories = {};
    const filteredRecords = record.value.filter(record => {
      const matchesBarangay = barangayFilter.value === 'All Barangays' || record.barangay === barangayFilter.value;
      return matchesBarangay;
    });
  
    filteredRecords.forEach(record => {
      const bmi = calculateBMI(record);
      const category = getBMICategory(bmi);
      if (category) {
        categories[category] = (categories[category] || 0) + 1;
      }
    });
  
    const totalRecords = filteredRecords.length;
    return Object.keys(categories).map(category => ({
      name: category,
      percentage: totalRecords ? ((categories[category] / totalRecords) * 100).toFixed(2) : 0
    }));
  });
  
  const healthIssues = computed(() => {
    const issues = {};
    const filteredRecords = record.value.filter(record => {
      const matchesBarangay = barangayFilter.value === 'All Barangays' || record.barangay === barangayFilter.value;
      return matchesBarangay;
    });
  
    filteredRecords.forEach(record => {
      if (record.medical_condition) {
        const conditions = record.medical_condition.split(','); // Assuming conditions are comma-separated
        conditions.forEach(condition => {
          const trimmedCondition = condition.trim();
          if (trimmedCondition && trimmedCondition.toLowerCase() !== 'none') {
            issues[trimmedCondition] = (issues[trimmedCondition] || 0) + 1;
          }
        });
      }
    });
  
    const totalRecords = filteredRecords.length;
    return Object.keys(issues).map(issue => ({
      name: issue,
      percentage: totalRecords ? ((issues[issue] / totalRecords) * 100).toFixed(2) : 0
    }));
  });
  
  const showBMIDetails = (category) => {
    bmiPatients.value = record.value.filter(record => {
      const bmi = calculateBMI(record);
      return getBMICategory(bmi) === category;
    });
    showBMIDialog.value = true;
  };
  
  const showHealthIssueDetails = (issue) => {
    healthIssuePatients.value = record.value.filter(record => {
      if (record.medical_condition) {
        const conditions = record.medical_condition.split(',');
        return conditions.some(condition => condition.trim().toLowerCase() === issue.toLowerCase());
      }
      return false;
    });
    showHealthIssueDialog.value = true;
  };
  
  fetchPatientRecords();
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .barangay-search-row {
    margin-bottom: 20px;
  }
  
  h2 {
    color: #FF42CD;
    margin-bottom: 10px;
  }
  

  tbody tr {
    transition: background-color 0.3s ease;
  }
  
  tbody tr:hover {
    background-color: rgba(255, 66, 205, 0.1); /* Light pink background on hover */
    cursor: pointer;
  }
  
  tbody tr:hover td {
    background-color: rgba(255, 66, 205, 0.1); /* Ensure entire row highlights */
  }
  </style>