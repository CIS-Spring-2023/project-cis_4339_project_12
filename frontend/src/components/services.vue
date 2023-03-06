<script>
import useVuelidate from '@vuelidate/core'
import { required, email, alpha, numeric } from '@vuelidate/validators'
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API

export default {
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) }
  },
  data() {
    return {
      activeServiceID:-1,
      activeServiceName:"Service",
      activeServiceStatus:false,
      displayedServiceStatus:"Disabled",
      services: [
        {id: 0, name: "Family Support", status: false},
        {id: 1, name: "Adult Education", status: false},
        {id: 2, name: "Youth Services Program", status: false},
        {id: 3, name: "Early Childhood Education", status: true}
      ],
      org: '',
    }
  },
  created() {
    this.getServices()
    console.log(this.services);
  },
  mounted() {
    window.scrollTo(0, 0)
  },
  methods: {
    //modified from findClient
    /**
     * getServices code adjusted from findClients
     */
    
     statusFilter(arg){
        if(arg == true){
          return "Enabled";
        }else{
          return "Disabled";
      }
    },
    getServices() {
      axios.get(`${apiURL}/services`).then((res) => {
        this.services = res.data
      })
      window.scrollTo(0, 0)
    },
    selectService(serviceID,serviceName,serviceStatus){
      console.log(serviceID+" "+serviceName+" "+serviceStatus);
      this.activeServiceName = serviceName;
      this.activeServiceID = serviceID;
      this.activeServiceStatus=serviceStatus;
      this.displayedServiceStatus=this.statusFilter(serviceStatus);
      //this.$router.push({ name: 'updateclient', params: { id: clientID } })
    },
    updateButton(){
      this.$router.push({ name: 'updateService', params: { id: this.activeServiceID, name: this.activeServiceName, status: this.activeServiceStatus } });
    },
    deleteButton(){
      this.$router.push({ name: 'deleteService', params: { id: this.activeServiceID}});
    },
    createButton(){
      this.$router.push({ name: 'createService', params: { id: this.activeServiceID, name: this.activeServiceName, status: this.activeServiceStatus } });
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
                        <input
                        type="text"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        v-model="activeServiceName"
                        />
                    </label>
                </div>
                <div class="flex flex-col col-span-2">
                    <label class="block">
                        <span class="text-gray-700">Service Status: </span>
                    </label>
                    <select class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      v-model="displayedServiceStatus"
                    >  
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
                <!--
                    Service model currently does not exist. 
                    Future service model will reflect these standards.
                -->
                <tr
                @click="selectService(service.id,service.name,service.status)"
                v-for="service in services"
                :key="service.id"
                >
                <td class="p-2 text-left">
                    {{ service.name}}
                </td>
                <td class="p-2 text-left">
                  {{ statusFilter(service.status)}}
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
                        type="submit"
                        @click="createButton"
                        >
                    Create
                  </button>
                </div>
                <div class="flex flex-col col-span-1">
                    <button
                        class="bg-green-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        @click="updateButton"
                      >
                    Update
                  </button>
                </div>
                <div class="flex flex-col col-span-1">
                    <button
                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        @click="deleteButton"
                    >
                    Delete
                  </button>
                </div>

            </div>
        </div>
        <div class="col-span-1"></div>
    </div>
    <!--button list (Add, Delete, Update)-->
  </main>
</template>
