<template>
    <div class="card">
        <div class="card-title">
            <p>
                <span>
                    Weer in
                </span>
                <span class="destination">
                    {{ city }}
                </span>
            </p>
        </div>

    </div>
</template>

<script>
export default {
    name: "WeatherDataCard",
    props: {
        city: { type: String, required: true }
    }
}
</script>