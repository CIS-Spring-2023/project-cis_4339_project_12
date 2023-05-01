<script>
import { DateTime } from 'luxon'
import axios from 'axios'
import AttendanceChart from './barChart.vue'
import AttendancePieChart from './pieChart.vue'
const apiURL = import.meta.env.VITE_ROOT_API;

export default {
  components: {
    AttendanceChart,
    AttendancePieChart
  },
  data() {
    return {
      recentEvents: [],
      labels: [],
      zLabels: [],
      pieChartData: [],//zipCode, count
      barChartData: [],//event name, attendees
      loading: false,
      error: null
    }
  },
  mounted() {
    this.getAttendanceData()
  },
  methods: {
    async searchClientID(argID) {
      let endpoint = ''
      endpoint = `clients/:${argID}`

    },
    async getAttendanceData() {
      try {
        this.error = null
        this.loading = true
        //fetch the attendence data
        const response = await axios.get(`${apiURL}/events/attendance`)
        this.recentEvents = response.data
        //create labels for the attendance data
        this.labels = response.data.map(
          (item) => `${item.name} (${this.formattedDate(item.date)})`
        )

        //filter out empty (0) values from the result sets
        //0's from both label array and barChartData set for bar chart 
        let tempbarChartData = this.recentEvents.map((event) => [event.attendees.length])
        let i = 0;
        tempbarChartData.forEach(item => {
          console.log(item)
          if (item > 0) {
            this.barChartData.push(item)
          } else {
            this.labels.splice(i, 1)
          }
          i++;
        })

        //Create a stripped down linear array to filter
        let preProcZipData = this.recentEvents.map((event) => [event.attendees])
        let unfilteredAttendees = []
        preProcZipData.forEach(element => {
          element.forEach(element2 => {
            element2.forEach(element3 => {
              unfilteredAttendees.push(element3)
            })
          })
        })

        //filter out duplicate attendees
        let uniqueAttendee = [];
        unfilteredAttendees.forEach(attendee => {
          let addAttendee = true
          uniqueAttendee.forEach(fAttendee => {
            if (fAttendee === attendee) {
              addAttendee = false
            }
          })
          if (addAttendee) {
            uniqueAttendee.push(attendee)
          }

        })

        //create a unique list of zipcodes from the reponse set
        const zipCodeData = [];
        const cResponse = []
        uniqueAttendee.forEach(element => {
          cResponse.push(axios.get(`${apiURL}/clients/id/${element}`).then(
            element => element.data
          ))
        })

        //We will go through the array we created and count duplicate zip codes
        //resulting array should have sub arrays that look like
        //[zipCode: 7777777, count: 1]
        const wait = await Promise.all(cResponse).then(Attendees => {
          Attendees.forEach(attendee => {
            let addAttendee = true
            zipCodeData.forEach(zip => {
              let i = 0;
              if (zip.zipCode === attendee.address.zip) {
                addAttendee = false
                zipCodeData[i].count++
              }
              i = i + 1
            })
            if (addAttendee && attendee.address.zip.length > 0) {
              zipCodeData.push({ zipCode: '' + attendee.address.zip, count: 1 })
            }
          })

          //pass the zipcode data to the pie chart
          this.pieChartData = zipCodeData
        })
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: 'Server Response',
            message: err.message
          }
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: 'Unable to Reach Server',
            message: err.message
          }
        } else {
          // There's probably an error in your code
          this.error = {
            title: 'Application Error',
            message: err.message
          }
        }
      }
      this.loading = false
    },
    formattedDate(datetimeDB) {
      const dt = DateTime.fromISO(datetimeDB, {
        zone: 'utc'
      })
      return dt
        .setZone(DateTime.now().zoneName, { keepLocalTime: true })
        .toLocaleString()
    },
    // method to allow click through table to event details
    editEvent(eventID) {
      this.$router.push({ name: 'eventdetails', params: { id: eventID } })
    }
  }
}
</script>

<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Welcome
      </h1>
      <br />
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div class="ml-10"></div>
        <div class="flex flex-col col-span-2">
          <table class="min-w-full shadow-md rounded">
            <thead class="bg-gray-50 text-xl">
              <tr class="p-4 text-left">
                <th class="p-4 text-left">Event Name</th>
                <th class="p-4 text-left">Event Date</th>
                <th class="p-4 text-left">Number of Attendees</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr @click="editEvent(event._id)" v-for="event in recentEvents" :key="event._id">
                <td class="p-2 text-left">{{ event.name }}</td>
                <td class="p-2 text-left">{{ formattedDate(event.date) }}</td>
                <td class="p-2 text-left">{{ event.attendees.length }}</td>
              </tr>
            </tbody>
          </table>
          <div>
            <!--add &&!error back-->
            <AttendanceChart v-if="!loading" :label="labels" :chart-data="barChartData"></AttendanceChart>
            <AttendancePieChart v-if="!loading" :label="labels" :chart-data="pieChartData"></AttendancePieChart>
            <!-- Start of loading animation -->
            <div class="mt-40" v-if="loading">
              <p class="text-6xl font-bold text-center text-gray-500 animate-pulse">
                Loading...
              </p>
            </div>
            <!-- End of loading animation -->

            <!-- Start of error alert -->
            <div class="mt-12 bg-red-50" v-if="error">
              <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">
                {{ error.title }}
              </h3>
              <p class="p-4 text-lg font-bold text-red-900">
                {{ error.message }}
              </p>
            </div>
            <!-- End of error alert -->
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
