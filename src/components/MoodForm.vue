<template>
  <div class="mood-container">
    <h2>Mood Check-in</h2>
    <div class="input-group">
      <input v-model="name" placeholder="Enter your name" />
      <textarea v-model="mood" placeholder="How are you feeling today?"></textarea>
      <button @click="handleSubmit" :disabled="loading">
        {{ loading ? 'Sending...' : 'Submit' }}
      </button>
    </div>

    <div v-if="aiResponse" class="ai-box">
      <h3>AI Advisor:</h3>
      <p>{{ aiResponse }}</p>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const name = ref('');
const mood = ref('');
const aiResponse = ref('');
const errorMessage = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  if (!name.value || !mood.value) {
    errorMessage.value = "Please fill in both fields.";
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  aiResponse.value = ''; // Clear previous response
  
  try {
    // 🌐 Your live Render Backend URL
    const API_URL = "https://mental-health-backend-api-1.onrender.com/api/mood"; 

    const response = await axios.post(API_URL, {
      name: name.value,
      mood: mood.value
    });

    // Check if response has data and set it
    if (response.data && response.data.ai_response) {
      aiResponse.value = response.data.ai_response;
    } else {
      aiResponse.value = "The AI is thinking... but didn't give a specific answer. Try again!";
    }

  } catch (error) {
    console.error("Connection failed:", error);
    errorMessage.value = "Error: Could not reach AI Advisor. Check if the backend is awake!";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.mood-container { 
  max-width: 400px; 
  margin: 2rem auto; 
  padding: 20px;
  text-align: center; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border: 1px solid #eee;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.input-group { display: flex; flex-direction: column; gap: 15px; }
input, textarea { 
  padding: 12px; 
  border-radius: 8px; 
  border: 1px solid #ddd; 
  font-size: 1rem;
}
textarea { min-height: 100px; resize: vertical; }
button { 
  padding: 12px; 
  background: #42b983; 
  color: white; 
  border: none; 
  border-radius: 8px;
  cursor: pointer; 
  font-weight: bold;
  transition: background 0.3s;
}
button:hover { background: #38a171; }
button:disabled { background: #ccc; cursor: not-allowed; }
.ai-box { 
  margin-top: 25px; 
  padding: 20px; 
  background: #f0fdf4; 
  border-radius: 12px; 
  border-left: 6px solid #42b983; 
  text-align: left;
}
.ai-box h3 { margin-top: 0; color: #2c3e50; }
.error { color: #e74c3c; margin-top: 15px; font-weight: bold; }
</style>