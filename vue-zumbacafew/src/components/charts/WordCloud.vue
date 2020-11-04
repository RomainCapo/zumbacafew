<template>
    <div id="svgwordcloud">

    </div>
</template>

<script>
// TODO only import necessary
import * as d3 from "d3";
import ArtistsApi from '@/services/api/Artists';

export default {
    name: 'ChartWordCloud',
    data() {
        return ArtistsApi.getTermFrequency();
    }
}
</script>

<style scoped>

</style>