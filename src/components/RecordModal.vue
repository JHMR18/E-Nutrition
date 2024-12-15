<template>
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h2>Personal Info</h2>
        <p>First Name: {{ record.first_name }}</p>
        <p>Last Name: {{ record.last_name }}</p>
        <p>Email: {{ record.email }}</p>
        <p>Birth Date: {{ record.birth_date }}</p>
        <p>Age: {{ record.age }}</p>
        <p>Sex: {{ record.sex }}</p>
        <p>Phone Number: {{ record.phone_number }}</p>
        <p>Address: {{ record.address }}</p>
        <p>Street Address: {{ record.street_address }}</p>
        <p>Barangay: {{ record.barangay }}</p>
        <p>City: {{ record.city }}</p>
        <p>Province: {{ record.province }}</p>
        <p>Zipcode: {{ record.zipcode }}</p>
  
        <h2>Health History</h2>
        <p>Height (cm): {{ record.height }}</p>
        <p>Height Date Taken: {{ record.height_date_taken }}</p>
        <p>Weight (kg): {{ record.weight }}</p>
        <p>Weight Date Taken: {{ record.weight_date_taken }}</p>
  
        <h2>Sagutan ang mga katanungan</h2>
        <p>Kasalukuyan bang may iniinom na mga gamot?: {{ record.taking_meds }}</p>
        <p>Bumaba ba ang pagkain sa nakalipas na 3 buwan dahil sa pagkawala ng gana sa pagkain, mga problema sa panunaw, o mga paghihirap sa pagnguya o paglunon?: {{ record.eating_problems }}</p>
        <p>Nakaranas ba ng pagbaba ng timbang sa loob ng nakalipas na 3 buwan?: {{ record.reduced_weight }}</p>
        <p>Nakakaranas ba ng hirap na pagdumi?: {{ record.pooping_problems }}</p>
        <p>Kung babae, Ikaw ba ay nagdadalangtao?: {{ record.is_pregnant }}</p>
        <p>Kung babae, Ikaw ba ay nagpapasuso: {{ record.is_breast_feeding }}</p>
        <p>Ikaw ba ay naninigarilyo?: {{ record.is_smoking }}</p>
        <p>Umiinom ng alak?: {{ record.is_drinking }}</p>
  
        <h2>Physical Activity</h2>
        <p>Sedentary - madalas ay naka-upo, kalimitang gawain sa bahay na hindi mabigat: {{ record.sedentary }}</p>
        <p>Lightly Active - naglalaan ng 30 minuto simpleng ehersisyo araw-araw katulad ng walking, zumba: {{ record.lightly_active }}</p>
        <p>Moderately Active - mahigit isang oras na ehersisyo katulad ng jogging o lakad-takbo araw - araw, kung ang trabaho ay nagbubuhat at madalas naka-tayo: {{ record.moderately_active }}</p>
        <p>Very Active - dalawang oras na ehersisyo katulad ng jogging o lakad-takbo araw - araw, kung isang karpintero, construction worker: {{ record.very_active }}</p>
  
        <h2>Diagnosis</h2>
        <p>Ikaw ba ay nadiagnosed na may acute/chronic disease? {{ record.diagnosed_with_disease }}</p>
        <p>Medical Condition: {{ record.medical_condition }}</p>
        <p>Lab Test Result: {{ record.lab_test_result }}</p>
  
        <h2>Family Health History</h2>
        <table>
          <tr>
            <th>Relation</th>
            <th>Edad</th>
            <th>In Good Health</th>
            <th>Known Health Problems</th>
            <th>Alive</th>
          </tr>
          <tr v-for="family in record.family_history" :key="family.relation">
            <td>{{ family.relation }}</td>
            <td>{{ family.edad }}</td>
            <td>{{ family.in_good_health }}</td>
            <td>{{ family.known_health_problems }}</td>
            <td>{{ family.alive }}</td>
          </tr>
        </table>
  
        <button @click="$emit('close-modal')">Close</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    record: {
      type: Object,
      required: true
    },
    showModal: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['close-modal']);
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 80%;
    max-height: 90%;
    overflow-y: auto;
  }
  
  .modal-content h2 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #FF42CD;
  }
  
  .modal-content p {
    font-size: 16px;
    color: #666;
    margin-bottom: 10px;
  }
  
  .modal-content table {
    border-collapse: collapse;
    width: 100%;
  }
  
  .modal-content th, .modal-content td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  
  .modal-content th {
    background-color: #f0f0f0;
  }
  
  .modal-content button {
    background-color: #FF42CD;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
  
  .modal-content button:hover {
    background-color: #FF69B4;
  }
  </style>