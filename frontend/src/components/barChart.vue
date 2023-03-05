<template>
  <div>
    <div class="flex justify-center">
      <div class="w-1/2 ml-4">
        <div class="shadow-lg rounded-lg overflow-hidden">
          <canvas class="p-10" ref="zipCodeChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

 

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

 

export default {
  props: {
    chartData: {
      type: Array
    }
  },
  async mounted() {
    await new Chart(this.$refs.zipCodeChart, {
      type: 'doughnut',
      data: {
        labels: this.chartData.map(item => item.zipCode),
        datasets: [
          {
            borderWidth: 1,
            backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745', '#6c757d'],
            borderColor: '#fff',
            data: this.chartData.map(item => item.count)
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    })
  },
  methods: {
    getColor() {
      let channel = () => Math.random() * 255
      return `rgba(${channel()}, ${channel()}, ${channel()}, 0.2)`
    }
  }
}
</script>
