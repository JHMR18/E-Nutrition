<template>
    <div class="dashboard-container">
      <div class="charts-container">
        <div class="chart-container bmi-chart">
          <h2>BMI Category Distribution</h2>
          <canvas id="bmi-category-chart" width="300" height="300"></canvas>
        </div>
        <div class="chart-container health-chart">
          <h2>Health Issues Distribution</h2>
          <canvas id="health-issues-chart" width="500" height="300"></canvas>
        </div>
      </div>
  
      <div class="news-section">
        <h2>Health News & Updates</h2>
        <div class="news-grid">
          <div class="news-card">
            <img src="/images/covid-vaccine.jpg" alt="COVID-19 Vaccine">
            <h3>COVID-19 Booster Recommendations</h3>
            <p>Latest guidelines for booster shots and updated vaccination strategies.</p>
            <a href="https://www.cdc.gov/vaccines/covid-19/clinical-considerations/interim-considerations-us.html" class="read-more">Read More</a>
          </div>
          <div class="news-card">
            <img src="/images/mental-health.jpg" alt="Mental Health">
            <h3>Mental Health Awareness</h3>
            <p>Important tips for maintaining mental wellness during challenging times.</p>
            <a href="https://www.betterup.com/blog/mental-health-awareness#:~:text=Mental%20health%20awareness%20is%20the,and%20their%20conditions%20go%20untreated." class="read-more">Read More</a>
          </div>
          <div class="news-card">
            <img src="/images/nutrition.jpg" alt="Nutrition">
            <h3>Balanced Diet Strategies</h3>
            <p>Expert advice on maintaining a healthy diet for overall well-being.</p>
            <a href="https://www.cdc.gov/nccdphp/dnpao/features/healthy-eating-tips/index.html" class="read-more">Read More</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import axios from 'axios';
  
  // Register Chart.js components
  Chart.register(...registerables,ChartDataLabels);
  
  const record = ref([]);
  const token = localStorage.getItem('auth-token');
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
  
    return Object.keys(categories).map(category => ({
      name: category,
      count: categories[category]
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
  
    return Object.keys(issues).map(issue => ({
      name : issue,
      count: issues[issue]
    }));
  });
  
  onMounted(async () => {
  await fetchPatientRecords(); // Ensure data is loaded
  console.log('Fetched records:', record.value); // Debug fetched data
  console.log('BMI Categories:', bmiCategories.value); // Debug computed data
  console.log('Health Issues:', healthIssues.value); // Debug computed data
  renderCharts(); // Render charts after data is available
});

  
  const renderCharts = () => {
    const bmiData = bmiCategories.value;
    const healthData = healthIssues.value;
  
    // Pie Chart for BMI Categories
    const bmiChartCtx = document.getElementById('bmi-category-chart').getContext('2d');
    new Chart(bmiChartCtx, {
  type: 'pie',
  data: {
    labels: bmiData.map(item => item.name),
    datasets: [{
      data: bmiData.map(item => item.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'BMI Category Distribution'
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold'
        },
        formatter: (value, context) => `${value} (${context.chart.data.labels[context.dataIndex]})`
      }
    }
  }
});

  
    // Bar Chart for Health Issues
    const healthChartCtx = document.getElementById('health-issues-chart').getContext('2d');
    new Chart(healthChartCtx, {
  type: 'bar',
  data: {
    labels: healthData.map(item => item.name),
    datasets: [{
      label: 'Number of Patients',
      data: healthData.map(item => item.count),
      backgroundColor: '#FF42CD',
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Health Issues Distribution'
      },
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'top',
        formatter: (value) => value
      }
    }
  }
});

  };
  </script>
  
  <style scoped>
  .dashboard-container {
    max-width: 1500px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .charts-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }
  
  .chart-container {
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .bmi-chart {
    width: 35%;
  }
  
  .health-chart {
    width: 60%;
  }
  
  .news-section {
    background-color: #f0f4f8;
    border-radius: 10px;
    padding: 20px;
  }
  
  .news-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .news-card {
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .news-card:hover {
    transform: scale(1.05);
  }
  
  .news-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .news-card h3 {
    padding: 10px 15px;
    margin: 0;
    background-color: #e6f2ff;
  }
  
  .news-card p {
    padding: 10px 15px;
    color: #666;
  }
  
  .read-more {
    display: block;
    padding: 10px 15px;
    background-color: #FF42CD;
    color: white;
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }
  
  .read-more:hover {
    background-color: #357abd;
  }
  h2{
    color: #FF42CD;
  }
  </style>
  