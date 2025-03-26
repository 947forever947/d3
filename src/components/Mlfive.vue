<template>
  <div class="text-sentiment">
    <h2>ML5 文本情绪分析</h2>
    
    <div class="input-area">
      <textarea
        v-model="textInput"
        placeholder="输入英文文本 (建议50字以内)..."
        rows="5"
      ></textarea>
      <button 
        @click="analyzeSentiment"
        :disabled="!modelLoaded"
      >
        {{ modelLoaded ? '分析情绪' : '模型加载中...' }}
      </button>
    </div>

    <div v-if="result" class="result">
      <h3>分析结果：</h3>
      <p>情绪倾向: {{ sentimentLabel }}</p>
      <p>置信度: {{ result.score.toFixed(2) }}</p>
      <div class="confidence-bar">
        <div 
          class="confidence-fill" 
          :style="{ width: confidencePercentage + '%' }"
        ></div>
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,computed } from 'vue'
import ml5 from 'ml5'

type SentimentResult = {
  score: number
  label: 'positive' | 'negative'
}

// 响应式数据
const textInput = ref('')
const modelLoaded = ref(false)
const result = ref<SentimentResult | null>(null)
const error = ref<string>('')

// 初始化模型
let sentimentClassifier: any = null

onMounted(() => {
  // 加载预训练模型
  sentimentClassifier = ml5.sentiment('movieReviews', modelReady)
})

const modelReady = () => {
  modelLoaded.value = true
  console.log('模型加载完成!')
}

// 分析情绪
const analyzeSentiment = async () => {
  try {
    if (!textInput.value.trim()) {
      error.value = '请输入要分析的文本'
      return
    }


    const prediction = await sentimentClassifier.predict(textInput.value)
    console.log(prediction);
    result.value = {
      score: prediction.confidence,
      label: prediction.confidence > 0.5 ? 'positive' : 'negative'
    }
    error.value = ''
    
  } catch (err) {
    error.value = `分析失败: ${(err as Error).message}`
  }
}

// 计算可视化百分比
const confidencePercentage = computed(() => {
  if (!result.value) return 0
  return Math.abs((result.value.score - 0.5) * 200)
})

// 显示标签
const sentimentLabel = computed(() => {
  if (!result.value) return ''
  
  return result.value.label === 'positive' 
    ? `积极 👍 (${confidencePercentage.value.toFixed(1)}%)` 
    : `消极 👎 (${confidencePercentage.value.toFixed(1)}%)`
})
</script>

<style scoped>
.text-sentiment {
  max-width: 600px;
  margin: 2rem auto;
  padding: 20px;
}

textarea {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

button {
  padding: 12px 24px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.3s;
}

button:disabled {
  background-color: #9E9E9E;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.confidence-bar {
  height: 10px;
  background: #ddd;
  border-radius: 5px;
  margin: 10px 0;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #4CAF50);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.error {
  color: #f44336;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid currentColor;
  border-radius: 4px;
}
</style>
