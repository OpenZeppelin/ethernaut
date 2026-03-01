عقد `Stake` آمن للمراهنة على عملة ETH الأصلية ورمز ERC20 WETH، مع مراعاة تساوي قيمة الرمزين بنسبة 1:1. هل يمكنك استنزاف العقد؟


لإكمال هذا المستوى، يجب أن تفي حالة العقد بالشروط التالية:

- يجب أن يكون رصيد ETH في عقد `Stake` أكبر من 0.
- يجب أن يكون `totalStaked` أكبر من رصيد ETH في عقد `Stake`.
- يجب أن تكون مراهنًا.
- يجب أن يكون رصيد المراهنة الخاص بك 0.

###### أشياء قد تكون مفيدة:

* مواصفات [ERC-20](https://github.com/ethereum/ercs/blob/master/ERCS/erc-20.md).
* [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)