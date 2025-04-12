---
layout:   post
title:    "压缩即智慧？"
date:     "2023-05-18 01:00:00"
category: "Tech"
tags:     [MachineLearning, Insight]
---

## GPT 是一种文本的有损压缩/解压算法

[ChatGPT Is a Blurry JPEG of the Web](https://www.newyorker.com/tech/annals-of-technology/chatgpt-is-a-blurry-jpeg-of-the-web) 文章发表的时候 GPT-4 还没出来，但我觉得这篇文章真正揭示了 GPT/LLM 的本质 ——

<div style="border: 1px solid #ddd; border-radius: 10px; margin: 12px 0px; padding: 12px;">
💡 GPTs 是一种针对巨量文本内容的有损压缩与解压算法，ChatGPT 是被 OpenAI 筛选过的互联网文本内容的一份有损压缩的离线副本。
</div>

- 互联网上的文本内容，可以认为是高维空间的人类知识在一维空间上的“投影”，GPT-like 的压缩算法是根据这些投影出来的信息，建立起的一个高维空间（XX亿参数）的模型。
- Instruct 的作用，是让 GPT/LLM 学会如何解压信息。在使用 ChatGPT 的时候，模型根据你的输入，在高维空间选择了一个位置，打了一盏灯，调了方向和角度，投影到一维得到 tokens。
- 对应地，可以把搜索引擎当做是全互联网文本信息的无损压缩，但就像浏览 JPEG 这种小尺寸的缩略图比看 RAW 更方便一样，有损压缩天然更适合查询信息。
- 人类本身的记忆、学习的方式就是一种有损压缩，所谓 ”死记硬背” 暗示的就是这个人不聪明，而聪不聪明、或者说衡量智慧程度的度量，本质就是看你对信息的压缩比大不大，学了很少的信息就能融会贯通（推理能力强）的就是聪明的，其实就是压缩比高。
- 而压缩比的关键，在于 reasoning 的能力（或者反过来说，所谓 reasoning 就是寻找一种信息压缩比最高的算法）。
- 可以把所有 ChatGPT 的回答都当做它在用自己的有损信息做 “插值算法”，产生最能符合你要求的结果，当你要求 ChatGPT ”使用独立宣言的风格描述在烘干机中丢失袜子”时，他其实是在 “词汇空间” 中取两个点并生成占据它们之间位置的文本：*When in the Course of human events, it becomes necessary for one to separate his garments from their mates, in order to maintain the cleanliness and order thereof ……* 正是类似图像补全算法中的 “插值算法” —— 这种把有损信息补全的方式让我们产生了 GPT/LLM拥有 “智慧” 的错觉。
- 现在 GPT/LLM 的通病 “幻觉” 就是来源于这种插值算法，这是有损压缩的必然产物，只是有些错误信息过于明显以至于我们一眼就能识别，而绝大多数输出其实本质也是一种 “幻觉”，只是我们觉得真实信息应该也是这样因此无法识别；就像人类的虚假信息，源头的传播者并不觉得自己是在制造虚假信息，他不知道是自己 ”脑补“ 出来的而是觉得自己真的 “知道”，这也可以看成是他们大脑产生的 “幻觉”；

如果 ChatGPT 真的是上述所说的这样是对于真实世界信息的有损压缩，那么我们会有几个推论：

- 压缩后的数据质量非常取决于训练数据的 “清晰度”，反复使用模糊的图片去生成压缩图片是没任何意义的。因此 OpenAI 一定会竭尽所能，不让模型在训练时触到 GPT（或其他 LLM） 产出的语料（或者，如果发现 OpenAI 在竭尽所能把训练数据中清洗掉 GPT/LLM 生产的内容，也可以反过来印证 GPT/LLM 就是一种压缩算法的正确性）。这和现在市面上的 GPT copycats 用 ShareGPT 的语料蒸馏的路径会截然不同。
- 训练语料的信息含量越高、原创性（独特性）越强、越是不像 GPT/LLM 能产出的语料、语料的风格特色越是丰富多样 …… 训练出的 GPT/LLM 的质量才会越高。
- 真正具有原创能力的领域专家，将来在 GPT/LLM 的加持下，价值会十倍上升。
- 因为是压缩，目前 GPT/LLM 的创作能力只体现在 “缝合” 而无法真正 “原创”，可以做出 [AI 孙燕姿](https://www.youtube.com/results?search_query=ai+%E5%AD%99%E7%87%95%E5%A7%BF)唱周杰伦的歌，但无法创作出 「半岛铁盒」、「爱在西元前」。

后来 OpenAI 的首席科学家 Ilya Sutskever 在[与黄仁勋的对话](https://www.youtube.com/watch?v=XjSUJUL9ADw&t=625s)中确认了这个说法，他认为 “really good compression of the data would lead to unsupervised learning”，这个 insight 是创立 OpenAI 的两个 founding ideas 之一：

> We had two big initial ideas at the start of OpenAI that state that had a lot of staying power, and they stayed with us to this day … The first big idea that we had, which I was especially excited about very early, was the **idea of unsupervised learning through compression** … I really believed that **really good compression of the data would lead to unsupervised learning**. Now compression is not language commonly used to describe what is really being done until recently when suddenly it became apparent to many people that those GPTs actually compress the training data. There is a real mathematical sense in which training these auto-regressive generative models compresses the data, and intuitively you can see why that should work if you compress the data really well. You must extract all the hidden secrets which exist in it. Therefore that is the key.
>

其他：

- 睡眠有助于巩固新的记忆，将短期记忆转化为长期记忆，并提高认知功能。这很可能暗示着 GPT/LLM 的范式已经非常接近大脑了，每天睡觉的一个重要作用就是把短期记忆重新 “训练” 压缩进模型。
- 现在的 GPT/LLM 暂时离 AGI 还差不少，主要是如何赋予（教会）模型 reasoning 的能力，以使得压缩比可以百倍提升，但 CoT 的能力不太可能可以随着模型的尺寸增加线性增长出来。
