<template>
	<div 
		class="uni-card uni-card--shadow"
		:style="{'margin':isFull?0:margin,'padding':spacing,'box-shadow':isShadow?shadow:''}"
	>
		<slot name="title">
			<div v-if="title || extra" class="uni-card__header">
				<!-- 卡片标题 -->
				<div class="uni-card__header-box" @click="onClick('title')">
					<div v-if="thumbnail" class="uni-card__header-avatar">
						<img :src="thumbnail" class="uni-card__header-avatar-image"/>
					</div>
					<div class="uni-card__header-content">
						<span class="uni-card__header-content-title uni-ellipsis">{{ title }}</span>
						<span 
							v-if="title&&subTitle" 
							class="uni-card__header-content-subtitle uni-ellipsis"
						>
							{{ subTitle }}
						</span>
					</div>
				</div>
				<div class="uni-card__header-extra" @click="onClick('extra')">
					<span class="uni-card__header-extra-text">{{ extra }}</span>
				</div>
			</div>
		</slot>
		<!-- 卡片内容 -->
		<div class="uni-card__content" :style="{padding:padding}" @click="onClick('content')">
			<slot></slot>
		</div>
		<!-- 卡片操作 -->
		<div class="uni-card__actions" @click="onClick('actions')">
			<slot name="actions"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Card',
		props: {
			title: {
				type: String,
				default: ''
			},
			subTitle: {
				type: String,
				default: ''
			},
			padding: {
				type: String,
				default: '10px'
			},
			margin: {
				type: String,
				default: '15px'
			},
			spacing: {
				type: String,
				default: '0 10px'
			},
			extra: {
				type: String,
				default: ''
			},
			cover: {
				type: String,
				default: ''
			},
			thumbnail: {
				type: String,
				default: ''
			},
			isFull: {
				// 内容区域是否通栏
				type: Boolean,
				default: false
			},
			isShadow: {
				// 是否开启阴影
				type: Boolean,
				default: true
			},
			shadow: {
				type: String,
				default: '0px 0px 3px 1px rgba(0, 0, 0, 0.08)'
			},
			border: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			onClick(type) {
				this.$emit('click', type)
			}
		}
	}
</script>

<style>
	.uni-card {
		margin: 0.625rem 0.625rem 0 0.625rem !important;
		padding: 0 0.5rem !important;
		border-radius: 0.25rem;
		overflow: hidden;
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
		background-color: #fff;
		flex: 1;
	}

	.uni-card__header {
		display: flex;
		border-bottom: 0.0625rem #EBEEF5 solid;
		flex-direction: row;
		align-items: center;
		padding: 0.625rem;
		overflow: hidden;
	}
	
	.uni-card__header-box {
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
		overflow: hidden;
	}

	.uni-card__header-avatar {
		width: 2.5rem;
		height: 2.5rem;
		overflow: hidden;
		border-radius: 0.3125rem;
		margin-right: 0.625rem;
	}

	.uni-card__header-avatar-image {
		flex: 1;
		width: 2.5rem;
		height: 2.5rem;
	}

	.uni-card__header-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		overflow: hidden;
	}

	.uni-card__header-content-title {
		font-size: 0.9375rem;
		color: #3a3a3a;
	}
	
	.uni-card__header-content-subtitle {
		font-size: 0.75rem;
		margin-top: 0.3125rem;
		color: #909399;
	}

	.uni-card__header-extra {
		line-height: 0.75rem;
	}

	.uni-card__header-extra-text {
		font-size: 0.75rem;
		color: #909399;
	}

	.uni-card__content {
		padding: 0.625rem;
		font-size: 0.875rem;
		color: #6a6a6a;
		line-height: 1.375rem;
	}

	.uni-card__actions {
		font-size: 0.75rem;
	}

	.uni-card--shadow {
		position: relative;
		box-shadow: 0 0rem 0.375rem 0.0625rem rgba(165, 165, 165, 0.2);
	}

	.uni-ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>