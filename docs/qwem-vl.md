本文介绍通义千问 API 的输入输出参数。

模型介绍、选型建议和使用方法，请参考文本生成模型概述。
您可以通过 OpenAI 兼容或 DashScope 的方式调用通义千问 API。

OpenAI 兼容
北京地域新加坡地域金融云
使用SDK调用时需配置的base_url：https://dashscope.aliyuncs.com/compatible-mode/v1

使用HTTP方式调用时需配置的endpoint：POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions

您需要已获取API Key并配置API Key到环境变量。如果通过OpenAI SDK进行调用，还需要安装SDK。
请求体
文本输入流式输出图像输入视频输入工具调用联网搜索异步调用文档理解文字提取
关于大模型分析图像的更多用法，请参见视觉理解。
PythonNode.jscurl
 
import OpenAI from "openai";

const openai = new OpenAI(
    {
        // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
        apiKey: process.env.DASHSCOPE_API_KEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);

async function main() {
    const response = await openai.chat.completions.create({
        model: "qwen-vl-max", // 此处以qwen-vl-max为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
        messages: [{role: "user",content: [
            { type: "image_url",image_url: {"url": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/dog_and_girl.jpeg"}},
            { type: "text", text: "这是什么？" },
        ]}]
    });
    console.log(JSON.stringify(response));
}

main();
model string （必选）

模型名称。

支持的模型：通义千问大语言模型（商业版、开源版）、通义千问VL、代码模型、通义千问Omni、数学模型。

通义千问Audio暂不支持OpenAI兼容模式，仅支持DashScope方式。
具体模型名称和计费，请参见模型列表。

messages array （必选）

由历史对话组成的消息列表。

消息类型

System Message object （可选）

模型的目标或角色。如果设置系统消息，请放在messages列表的第一位。

属性

QwQ 、Qwen3-VL模型不建议设置 System Message，QVQ 模型设置System Message不会生效。
User Message object （必选）

用户发送给模型的消息。

属性

Assistant Message object （可选）

模型对用户消息的回复。

属性

Tool Message object （可选）

工具的输出信息。

属性

stream boolean （可选） 默认值为 false

是否流式输出回复。参数值：

false：模型生成完所有内容后一次性返回结果。

true：边生成边输出，即每生成一部分内容就立即输出一个片段（chunk）。您需要实时地逐个读取这些片段以获得完整的结果。

Qwen3商业版（思考模式）、Qwen3开源版、QwQ、QVQ只支持流式输出。
stream_options object （可选）

当启用流式输出时，可通过将本参数设置为{"include_usage": true}，在输出的最后一行显示所使用的Token数。

如果设置为false，则最后一行不显示使用的Token数。
本参数仅在设置stream为true时生效。

modalities array （可选）默认值为["text"]

输出数据的模态，仅支持 Qwen-Omni 模型指定。可选值：

["text","audio"]：输出文本与音频；

["text"]：输出文本。

audio object （可选）

输出音频的音色与格式，仅支持 Qwen-Omni 模型，且modalities参数需要包含"audio"。

属性

temperature float （可选）

采样温度，控制模型生成文本的多样性。

temperature越高，生成的文本更多样，反之，生成的文本更确定。

取值范围： [0, 2)

由于temperature与top_p均可以控制生成文本的多样性，因此建议您只设置其中一个值。更多说明，请参见文本生成模型概述。

temperature默认值

不建议修改QVQ模型的默认temperature值 。
top_p float （可选）

核采样的概率阈值，控制模型生成文本的多样性。

top_p越高，生成的文本更多样。反之，生成的文本更确定。

取值范围：（0,1.0]

由于temperature与top_p均可以控制生成文本的多样性，因此建议您只设置其中一个值。更多说明，请参见文本生成模型概述。

top_p默认值

不建议修改QVQ模型的默认 top_p 值。
top_k integer （可选）

生成过程中采样候选集的大小。例如，取值为50时，仅将单次生成中得分最高的50个Token组成随机采样的候选集。取值越大，生成的随机性越高；取值越小，生成的确定性越高。取值为None或当top_k大于100时，表示不启用top_k策略，此时仅有top_p策略生效。

取值需要大于或等于0。

top_k默认值

通过 Python SDK调用时，请将 top_k 放入 extra_body 对象中，配置方式为：extra_body={"top_k":xxx}。
不建议修改QVQ模型的默认 top_k 值。
presence_penalty float （可选）

控制模型生成文本时的内容重复度。

取值范围：[-2.0, 2.0]。正数会减少重复度，负数会增加重复度。

适用场景：

较高的presence_penalty适用于要求多样性、趣味性或创造性的场景，如创意写作或头脑风暴。

较低的presence_penalty适用于要求一致性或专业术语的场景，如技术文档或其他正式文档。

presence_penalty默认值

原理介绍

示例

使用qwen-vl-plus-2025-01-25模型进行文字提取时，建议设置presence_penalty为1.5。
不建议修改QVQ模型的默认presence_penalty值。
response_format object （可选） 默认值为{"type": "text"}

返回内容的格式。可选值：{"type": "text"}或{"type": "json_object"}。设置为{"type": "json_object"}时会输出标准格式的JSON字符串。使用方法请参见：结构化输出。

如果指定该参数为{"type": "json_object"}，您需要在System Message或User Message中指引模型输出JSON格式，如：“请按照json格式输出。”
支持的模型

max_input_tokens integer （可选）

允许输入的最大 Token 长度。目前仅支持qwen-plus-0728/latest模型。

qwen-plus-latest 默认值：129,024

后续默认值可能调整至1,000,000。
qwen-plus-2025-07-28 默认值：1,000,000

通过 Python SDK 调用时，请通过extra_body配置。配置方式为：extra_body={"max_input_tokens": xxx}。
max_tokens integer （可选）

本次请求返回的最大 Token 数。

max_tokens 的设置不会影响大模型的生成过程，如果模型生成的 Token 数超过max_tokens，本次请求会返回截断后的内容。
默认值和最大值都是模型的最大输出长度。关于各模型的最大输出长度，请参见模型列表。

max_tokens参数适用于需要限制字数（如生成摘要、关键词）、控制成本或减少响应时间的场景。

qwen-vl-ocr、qwen-vl-ocr-latest、qwen-vl-ocr-2025-04-13、qwen-vl-ocr-2025-08-28模型的max_tokens参数（最大输出长度）默认为 4096，如需提高该参数值（4097~8192范围），请发送邮件至 modelstudio@service.aliyun.com进行申请，并提供以下信息：主账号ID、图像类型（如文档图、电商图、合同等）、模型名称、预计 QPS 和每日请求总数，以及模型输出长度超过4096的请求占比。
对于 QwQ、QVQ 与开启思考模式的 Qwen3 模型，max_tokens会限制回复内容的长度，不限制深度思考内容的长度。
vl_high_resolution_images boolean （可选）默认值为false

是否提高输入图片的默认Token上限，适用于Qwen-VL、QVQ模型。

False（默认值）：使用默认的Token处理图像

Qwen3-VL商业版及开源版、qwen-vl-max-0813及以后、qwen-vl-plus-0710及以后更新的模型：默认Token上限为2560

QVQ及其他Qwen-VL模型：默认Token上限为1280

True：输入图片的Token上限将提高为16384

支持的模型

通过 Python SDK调用时，请将 vl_high_resolution_images 放入 extra_body 对象中，配置方式为：extra_body={"vl_high_resolution_images":xxx}。
n integer （可选） 默认值为1

生成响应的个数，取值范围是1-4。对于需要生成多个响应的场景（如创意写作、广告文案等），可以设置较大的 n 值。

当前仅支持 qwen-plus、 Qwen3（非思考模式）、qwen-plus-character 模型，且在传入 tools 参数时固定为1。
设置较大的 n 值不会增加输入 Token 消耗，会增加输出 Token 的消耗。
enable_thinking boolean （可选）

是否开启思考模式，适用于 Qwen3 、Qwen3-Omni-Flash、Qwen3-VL模型。

Qwen3 商业版模型默认值为 False，Qwen3 开源版模型默认值为 True。

通过 Python SDK 调用时，请通过extra_body配置。配置方式为：extra_body={"enable_thinking": xxx}。
thinking_budget integer （可选）

思考过程的最大长度，只在enable_thinking为true时生效。适用于Qwen3-VL、Qwen3 的商业版与开源版模型。详情请参见限制思考长度。

默认值为模型最大思维链长度。
通过 Python SDK 调用时，请通过extra_body配置。配置方式为：extra_body={"thinking_budget": xxx}。
seed integer （可选）

设置seed参数会使文本生成过程更具有确定性，通常用于使模型每次运行的结果一致。

在每次模型调用时传入相同的seed值（由您指定），并保持其他参数不变，模型将尽可能返回相同的结果。

取值范围：0到231−1。

seed默认值

logprobs boolean （可选）默认值为 false

是否返回输出 Token 的对数概率，可选值：

true

返回；

false

不返回。

思考阶段生成的内容（reasoning_content）不会返回对数概率。
支持的模型

top_logprobs integer （可选）默认值为0

指定在每一步生成时，返回模型最大概率的候选 Token 个数。

取值范围：[0,5]

仅当 logprobs 为 true 时生效。

stop string 或 array （可选）

使用stop参数后，当模型生成的文本即将包含指定的字符串或token_id时，将自动停止生成。

您可以在stop参数中传入敏感词来控制模型的输出。

stop为array类型时，不可以将token_id和字符串同时作为元素输入，比如不可以指定stop为["你好",104307]。
tools array （可选）

可供模型调用的工具数组，可以包含一个或多个工具对象。一次Function Calling流程模型会从中选择一个工具（开启parallel_tool_calls可以选择多个工具）。

目前不支持通义千问VL/Audio，也不建议用于数学和代码模型（Qwen3-Coder 模型除外）。
属性

tool_choice string 或 object （可选）默认值为 "auto"

如果您希望对于某一类问题，大模型能够采取制定好的工具选择策略（如强制使用某个工具、强制不使用工具），可以通过修改tool_choice参数来强制指定工具调用的策略。可选值：

"auto"

表示由大模型进行工具策略的选择。

"none"

如果您希望无论输入什么问题，Function Calling 都不会进行工具调用，可以设定tool_choice参数为"none"；

{"type": "function", "function": {"name": "the_function_to_call"}}

如果您希望对于某一类问题，Function Calling 能够强制调用某个工具，可以设定tool_choice参数为{"type": "function", "function": {"name": "the_function_to_call"}}，其中the_function_to_call是您指定的工具函数名称。

若模型输出思考过程，则不支持设置为该值。
parallel_tool_calls boolean （可选）默认值为 false

是否开启并行工具调用。参数为true时开启，为false时不开启。并行工具调用详情请参见：并行工具调用。

translation_options object （可选）

当您使用翻译模型时需要配置的翻译参数。

属性

若您通过Python SDK调用，请通过extra_body配置。配置方式为：extra_body={"translation_options": xxx}。
enable_search boolean （可选）

模型在生成文本时是否使用互联网搜索结果进行参考。取值如下：

true：启用互联网搜索，模型会将搜索结果作为文本生成过程中的参考信息，但模型会基于其内部逻辑判断是否使用互联网搜索结果。

如果模型没有搜索互联网，建议优化Prompt，或设置search_options中的forced_search参数开启强制搜索。
false（默认）：关闭互联网搜索。

启用互联网搜索功能可能会增加 Token 的消耗。
若您通过 Python SDK调用，请通过extra_body配置。配置方式为：extra_body={"enable_search": True}。
支持的模型

search_options object （可选）

联网搜索的策略。详情参见联网搜索。

属性

若您通过 Python SDK调用，请通过extra_body配置。配置方式为：extra_body={"search_options": xxx}。
X-DashScope-DataInspection string （可选）

在通义千问 API 的内容安全能力基础上，是否进一步识别输入输出内容的违规信息。取值如下：

'{"input":"cip","output":"cip"}'：进一步识别；

不设置该参数：不进一步识别。

通过 HTTP 调用时请放入请求头：-H "X-DashScope-DataInspection: {\"input\": \"cip\", \"output\": \"cip\"}"；

通过 Python SDK 调用时请通过extra_headers配置：extra_headers={'X-DashScope-DataInspection': '{"input":"cip","output":"cip"}'}。

详细使用方法请参见内容审核。

不支持通过 Node.js SDK设置。
不适用于 Qwen-VL 系列模型。
chat响应对象（非流式输出）
 
{
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "我是阿里云开发的一款超大规模语言模型，我叫通义千问。"
            },
            "finish_reason": "stop",
            "index": 0,
            "logprobs": null
        }
    ],
    "object": "chat.completion",
    "usage": {
        "prompt_tokens": 3019,
        "completion_tokens": 104,
        "total_tokens": 3123,
        "prompt_tokens_details": {
            "cached_tokens": 2048
        }
    },
    "created": 1735120033,
    "system_fingerprint": null,
    "model": "qwen-plus",
    "id": "chatcmpl-6ada9ed2-7f33-9de2-8bb0-78bd4035025a"
}
id string

本次调用的唯一标识符。

choices array

模型生成内容的数组，可以包含一个或多个choices对象。

属性

created integer

本次chat请求被创建时的时间戳。

model string

本次chat请求使用的模型名称。

object string

始终为chat.completion。

service_tier string

该参数当前固定为null。

system_fingerprint string

该参数当前固定为null。

usage object

本次chat请求使用的 Token 信息。

属性

chat响应chunk对象（流式输出）
 
{"id":"chatcmpl-e30f5ae7-3063-93c4-90fe-beb5f900bd57","choices":[{"delta":{"content":"","function_call":null,"refusal":null,"role":"assistant","tool_calls":null},"finish_reason":null,"index":0,"logprobs":null}],"created":1735113344,"model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,"system_fingerprint":null,"usage":null}
{"id":"chatcmpl-e30f5ae7-3063-93c4-90fe-beb5f900bd57","choices":[{"delta":{"content":"我是","function_call":null,"refusal":null,"role":null,"tool_calls":null},"finish_reason":null,"index":0,"logprobs":null}],"created":1735113344,"model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,"system_fingerprint":null,"usage":null}
{"id":"chatcmpl-e30f5ae7-3063-93c4-90fe-beb5f900bd57","choices":[{"delta":{"content":"来自","function_call":null,"refusal":null,"role":null,"tool_calls":null},"finish_reason":null,"index":0,"logprobs":null}],"created":1735113344,"model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,"system_fingerprint":null,"usage":null}
{"id":"chatcmpl-e30f5ae7-3063-93c4-90fe-beb5f900bd57","choices":[{"delta":{"content":"阿里","function_call":null,"refusal":null,"role":null,"tool_calls":null},"finish_reason":null,"index":0,"logprobs":null}],"created":1735113344,"model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,"system_fingerprint":null,"usage":null}
{"id":"chatcmpl-e30f5ae7-3063-93c4-90fe-beb5f900bd57","choices":[{"delta":{"content":"云的超大规模","function_call":null,"refusal":null,"role":null,"tool_calls":null},"finish_reason":null,"index":0,"logprobs":null}],"created":1735113344,"model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,"system_fingerprint":null,"usage":null}
{"id":"chatcmpl-e30f5ae7-3063-93c4-90fe-beb5f900bd57","choices":[{"delta":{"content":"语言模型，我","function_call":null,"refusal":null,"role":null,"tool_calls":null},"finish_reason":null,"index":0,"logprobs":null}],"created":1735113344,"model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,"system_fingerprint":null,"usage":null}
{"id":"chatcmpl-e30f5ae7-3063-93c4-90fe-beb5f900bd57","choices":[{"delta":{"content":"叫通义千","function_call":null,"refusal":null,"role":null,"tool_calls":null},"finish_reason":null,"index":0,"logprobs":null}],"created":1735113344,"model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,"system_fingerprint":null,"usage":null}
{"id":"chatcmpl-e30f5ae7-3063-93c4-90fe-beb5f900bd57","choices":[{"delta":{"content":"问。","function_call":null,"refusal":null,"role":null,"tool_calls":null},"finish_reason":null,"index":0,"logprobs":null}],"created":1735113344,"model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,"system_fingerprint":null,"usage":null}
{"id":"chatcmpl-e30f5ae7-3063-93c4-90fe-beb5f900bd57","choices":[{"delta":{"content":"","function_call":null,"refusal":null,"role":null,"tool_calls":null},"finish_reason":"stop","index":0,"logprobs":null}],"created":1735113344,"model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,"system_fingerprint":null,"usage":null}
{"id":"chatcmpl-e30f5ae7-3063-93c4-90fe-beb5f900bd57","choices":[],"created":1735113344,"model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,"system_fingerprint":null,"usage":{"completion_tokens":17,"prompt_tokens":22,"total_tokens":39,"completion_tokens_details":null,"prompt_tokens_details":{"audio_tokens":null,"cached_tokens":0}}}
id string

本次调用的唯一标识符。每个chunk对象有相同的 id。

choices array

模型生成内容的数组，可包含一个或多个choices对象。如果设置include_usage参数为true，则最后一个chunk为空。

属性

created integer

本次chat请求被创建时的时间戳。每个chunk对象有相同的时间戳。

model string

本次chat请求使用的模型名称。

object string

始终为chat.completion.chunk。

service_tier string

该参数当前固定为null。

system_fingerprintstring

该参数当前固定为null。

usage object

本次chat请求使用的Token信息。只在include_usage为true时，在最后一个chunk显示。

属性