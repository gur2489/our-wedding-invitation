<script lang="ts">
    import letterBottom_pc from '$lib/assets/info.jpg';
    import letterBottom_mo from '$lib/assets/info.jpg';
</script>

<section class="info">
    <div class="img-wrapper">
        <picture>
            <source media="(min-width: 769px)" srcset={letterBottom_pc} />
            <source media="(max-width: 768px)" srcset={letterBottom_mo} />
            <img class="letter-bottom" src={letterBottom_pc} alt="letter bottom" />
        </picture>
    </div>
</section>

<style>
    .info {
        text-align: center;
    }

    .img-wrapper img {
        max-width: 100%;
        height: auto;
    }
</style>
