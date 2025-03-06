<script lang="ts" setup>
import { useUserStore } from '../../stores/user-store'
const { doLogout } = useUserStore()

doLogout()
</script>
