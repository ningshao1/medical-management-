<template>
    <el-input
            class="kld-input-number"
            ref="input"
            :value="currentInputValue"
            :placeholder="placeholder"
            :disabled="inputNumberDisabled"
            :size="inputNumberSize"
            :max="max"
            :min="min"
            :name="name"
            :label="label"
            @keydown.up.native.prevent="increase"
            @keydown.down.native.prevent="decrease"
            @blur="handleBlur"
            @focus="handleFocus"
            @change="handleInputChange"
    >
        <slot name="prepend" slot="prepend"></slot>
        <slot name="append" slot="append"></slot>
    </el-input>
</template>

<script>
    import InputNumber from 'element-ui/lib/input-number';

    export default InputNumber;
</script>