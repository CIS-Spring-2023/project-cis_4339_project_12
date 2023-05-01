<script>
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useLoggedInUserStore } from "@/store/loggedInUser";

export default {
  setup() {
    const user = useLoggedInUserStore();
    return { v$: useVuelidate({ $autoDirty: true }) }
  },
  data() {
    return {
      displayedServiceStatus: "Disabled",
      activeService: {
        _id: '',
        name: '',
        status: ''
      },
      searchBy: "Service Name",
      alertMessage: "",
      errorMessage: false,
      alertVisibility: false,
      services: [],
      org: '',
    }
  },
  created() {
    this.getServices()
  },
  mounted() {
    window.scrollTo(0, 0)
  },
  methods: {
    //modified from findClient
    /**
     * getServices code adjusted from findClients
     */
    findServices() {
      let endpoint = ''
      if (this.searchBy === 'Service Name') {
        endpoint = `services/search/?name=${this.activeService.name}&searchBy=name`
      } else if (this.searchBy === 'Service Status') {
        endpoint = `services/search/?status=${this.activeService.status}&searchBy=status`
      }
      axios.get(`${apiURL}/${endpoint}`).then((res) => {
        this.queryData = res.data
      })
    },
    //take a 'enabled/disabled' and turn it into a boolean
    revStatusFilter(arg) {
      if (arg === "Enabled") {
        return true;
      } else {
        return false;
      }
    },
    //take a 'boolean' and turn it into text
    statusFilter(arg) {
      if (arg == true) {
        return "Enabled";
      } else {
        return "Disabled";
      }
    },
    //obtain a list of services
    getServices() {
      axios.get(`${apiURL}/services`).then((res) => {
        this.services = res.data
      })
      window.scrollTo(0, 0)
    },
    //take the field values for the service selected and store them for use in the activeService object
    //and the displayServiceStatus variable for use in CRUD operations
    selectService(serviceID, serviceName, serviceStatus) {
      this.activeService.name = serviceName;
      this.activeService._id = serviceID;
      this.activeService.status = serviceStatus;
      this.displayedServiceStatus = this.statusFilter(serviceStatus);
    },
    //use stored activeService object values to preform an update
    updateButton() {
      this.alertMessage = "Service updated";
      this.activeService.status = this.revStatusFilter(this.displayedServiceStatus)
      axios.put(`${apiURL}/services/update/${this.activeService._id}`, this.activeService).then(() => { })
      this.$router.push("/");
    },
    //post a delete request according to the selected element ID
    deleteButton() {
      this.alertMessage = "Service deleted";
      axios.delete(`${apiURL}/services/${this.activeService._id}`).then(() => {
        alert('Event has been deleted.')
        this.$router.push("/");
      })
    },
    //post a create request according to the values in the activeService Object
    createButton() {
      this.alertMessage = "Service created";
      this.activeService.status = this.revStatusFilter(this.displayedServiceStatus)

      //a temporary variable for creating the new service
      //Distinct in that there is no defined _id which is neccessary in the 
      //activeService object for certain function calls.
      let newService = {
        name: this.activeService.name,
        status: this.activeService.status
      }

      axios
        .post(`${apiURL}/services`, newService)
        .then(() => {
          alert(this.alertMessage)
          this.$router.push("/");
        })
        .catch((error) => {
          alert(`${error.response.data}`);
        })
    },
  }
}
</script>
<template>
  <main>
    <br>
    <!--Title-->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="col-span-1"></div>
      <!--Table 1 Edit area-->
      <!--Table 1-->
      <div class="flex flex-col col-span-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <!-- Service field -->
          <div class="flex flex-col col-span-2">
            <label class="block">
              <span class="text-gray-700">Service Name</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="activeService.name" />
            </label>
          </div>
          <div class="flex flex-col col-span-2">
            <label class="block">
              <span class="text-gray-700">Service Status: </span>
            </label>
            <select
              class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="displayedServiceStatus">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>

          </div>
        </div>
        <br>
        <table class="min-w-full shadow-md rounded min-h-500">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Service</th>
              <th class="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr @click="selectService(service._id, service.name, service.status)" v-for="service in services"
              :key="service._id">
              <td class="p-2 text-left">
                {{ service.name }}
              </td>
              <td class="p-2 text-left">
                {{ statusFilter(service.status) }}
              </td>
            </tr>
          </tbody>
        </table>
        <br>
        <br>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10">
          <!-- Buttons field -->
          <div class="col-span-1"></div>
          <div class="flex flex-col col-span-1">
            <button
              class="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit" @click="createButton">
              Create
            </button>
          </div>
          <div class="flex flex-col col-span-1">
            <button
              class="bg-green-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit" @click="updateButton">
              Update
            </button>
          </div>
          <div class="flex flex-col col-span-1">
            <button
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit" @click="deleteButton">
              Delete
            </button>
          </div>
        </div>
        <!-- Alert message area to demonstrate button functionality-->
        <!--Alert class divs are bootstrap sourced-->
        <br>
        <div class="alert alert-primary" v-if="alertVisibility" role="alert">
          {{ alertMessage }}
        </div>
        <div class="alert alert-danger" v-if="errorMessage" role="alert">
          {{ alertMessage }}
        </div>

      </div>
      <div class="col-span-1"></div>
    </div>
    <!--button list (Add, Delete, Update)-->
  </main>
</template>
