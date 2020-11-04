<template>
  <Header/>
  <Beeswarm/>
  <Footer/>
</template>

<script>
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
//import Beeswarm from '@/components/charts/Beeswarm'

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    //Beeswarm
  }
}
</script>
