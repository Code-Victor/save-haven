type Theme = {
  background0: string;
  background025: string;
  background05: string;
  background075: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
  color7: string;
  color8: string;
  color9: string;
  color10: string;
  color11: string;
  color12: string;
  color0: string;
  color025: string;
  color05: string;
  color075: string;
  background: string;
  backgroundHover: string;
  backgroundPress: string;
  backgroundFocus: string;
  borderColor: string;
  borderColorHover: string;
  borderColorFocus: string;
  borderColorPress: string;
  color: string;
  colorHover: string;
  colorPress: string;
  colorFocus: string;
  colorTransparent: string;
  placeholderColor: string;
  outlineColor: string;
  green1: string;
  green2: string;
  green3: string;
  green4: string;
  green5: string;
  green6: string;
  green7: string;
  green8: string;
  green9: string;
  green10: string;
  purple1: string;
  purple2: string;
  purple3: string;
  purple4: string;
  purple5: string;
  purple6: string;
  purple7: string;
  purple8: string;
  purple9: string;
  purple10: string;
  shadowColor: string;
  shadowColorHover: string;
  shadowColorPress: string;
  shadowColorFocus: string;

}

function t(a: [number, number][]) {
  let res: Record<string,string> = {}
  for (const [ki, vi] of a) {
    res[ks[ki] as string] = vs[vi] as string
  }
  return res as Theme
}
const vs = [
  'rgba(255,255,255,0)',
  'rgba(255,255,255,0.75)',
  'rgba(255,255,255,0.5)',
  'rgba(255,255,255,0.25)',
  '#FFFFFF',
  '#F5F5F5',
  '#E8E8E8',
  '#DBDBDB',
  '#CECECE',
  '#C1C1C1',
  '#B4B4B4',
  '#A7A7A7',
  '#9A9A9A',
  '#8D8D8D',
  '#808080',
  '#737373',
  'rgba(18,18,18,0)',
  'rgba(18,18,18,0.25)',
  'rgba(18,18,18,0.5)',
  'rgba(18,18,18,0.75)',
  '#eeffef',
  '#cbfdcc',
  '#b2fdb3',
  '#8ffc90',
  '#79fb7b',
  '#58fa5a',
  '#50e452',
  '#3eb240',
  '#308a32',
  '#256926',
  '#eae6ec',
  '#bdb0c3',
  '#9d8aa6',
  '#70547d',
  '#543364',
  '#29003d',
  '#250038',
  '#1d002b',
  '#170022',
  '#11001a',
  'rgba(0,0,0,0.085)',
  'rgba(0,0,0,0.04)',
  '#181818',
  '#1F1F1F',
  '#262626',
  '#2D2D2D',
  '#343434',
  '#3B3B3B',
  '#424242',
  '#494949',
  '#505050',
  '#575757',
  '#5E5E5E',
  '#EBEBEB',
  '#0A1F0B',
  '#132A14',
  '#1C361D',
  '#254326',
  '#2E5030',
  '#376D39',
  '#408A43',
  '#4AA74C',
  '#53C456',
  '#5CE15F',
  '#2D1640',
  '#3D1D56',
  '#4E266D',
  '#613384',
  '#7642A0',
  '#8B51BB',
  '#A169D3',
  '#B784E8',
  '#CDA2F4',
  '#E4C3FF',
  'rgba(0,0,0,0.3)',
  'rgba(0,0,0,0.2)',
  'rgba(0,0,0,0.5)',
  'rgba(0,0,0,0.9)',
]

const ks = [
'background0',
'background025',
'background05',
'background075',
'color1',
'color2',
'color3',
'color4',
'color5',
'color6',
'color7',
'color8',
'color9',
'color10',
'color11',
'color12',
'color0',
'color025',
'color05',
'color075',
'background',
'backgroundHover',
'backgroundPress',
'backgroundFocus',
'borderColor',
'borderColorHover',
'borderColorFocus',
'borderColorPress',
'color',
'colorHover',
'colorPress',
'colorFocus',
'colorTransparent',
'placeholderColor',
'outlineColor',
'green1',
'green2',
'green3',
'green4',
'green5',
'green6',
'green7',
'green8',
'green9',
'green10',
'purple1',
'purple2',
'purple3',
'purple4',
'purple5',
'purple6',
'purple7',
'purple8',
'purple9',
'purple10',
'shadowColor',
'shadowColorHover',
'shadowColorPress',
'shadowColorFocus']


const n1 = t([[0, 0],[1, 1],[2, 2],[3, 3],[4, 4],[5, 5],[6, 6],[7, 7],[8, 8],[9, 9],[10, 10],[11, 11],[12, 12],[13, 13],[14, 14],[15, 15],[16, 16],[17, 17],[18, 18],[19, 19],[20, 4],[21, 5],[22, 6],[23, 4],[24, 7],[25, 8],[26, 5],[27, 7],[28, 15],[29, 14],[30, 15],[31, 14],[32, 16],[33, 12],[34, 17],[35, 20],[36, 21],[37, 22],[38, 23],[39, 24],[40, 25],[41, 26],[42, 27],[43, 28],[44, 29],[45, 30],[46, 31],[47, 32],[48, 33],[49, 34],[50, 35],[51, 36],[52, 37],[53, 38],[54, 39],[55, 40],[56, 40],[57, 41],[58, 41]])

export const light = n1
const n2 = t([[0, 16],[1, 19],[2, 18],[3, 17],[4, 42],[5, 43],[6, 44],[7, 45],[8, 46],[9, 47],[10, 48],[11, 49],[12, 50],[13, 51],[14, 52],[15, 53],[16, 0],[17, 3],[18, 2],[19, 1],[20, 42],[21, 43],[22, 44],[23, 42],[24, 45],[25, 46],[26, 43],[27, 45],[28, 53],[29, 52],[30, 53],[31, 52],[32, 0],[33, 50],[34, 3],[35, 54],[36, 55],[37, 56],[38, 57],[39, 58],[40, 59],[41, 60],[42, 61],[43, 62],[44, 63],[45, 64],[46, 65],[47, 66],[48, 67],[49, 68],[50, 69],[51, 70],[52, 71],[53, 72],[54, 73],[55, 74],[56, 74],[57, 75],[58, 75]])

export const dark = n2
const n3 = t([[0, 0],[1, 1],[2, 2],[3, 3],[4, 4],[5, 5],[6, 6],[7, 7],[8, 8],[9, 9],[10, 10],[11, 11],[12, 12],[13, 13],[14, 14],[15, 15],[16, 16],[17, 17],[18, 18],[19, 19],[20, 4],[21, 5],[22, 6],[23, 4],[24, 7],[25, 8],[26, 5],[27, 7],[28, 15],[29, 14],[30, 15],[31, 14],[32, 16],[33, 12],[34, 17]])

export const light_green = n3
export const light_purple = n3
const n4 = t([[0, 16],[1, 19],[2, 18],[3, 17],[4, 42],[5, 43],[6, 44],[7, 45],[8, 46],[9, 47],[10, 48],[11, 49],[12, 50],[13, 51],[14, 52],[15, 53],[16, 0],[17, 3],[18, 2],[19, 1],[20, 42],[21, 43],[22, 44],[23, 42],[24, 45],[25, 46],[26, 43],[27, 45],[28, 53],[29, 52],[30, 53],[31, 52],[32, 0],[33, 50],[34, 3]])

export const dark_green = n4
export const dark_purple = n4
const n5 = t([[28, 14],[29, 13],[30, 14],[31, 13]])

export const light_alt1 = n5
export const light_green_alt1 = n5
export const light_purple_alt1 = n5
const n6 = t([[28, 13],[29, 12],[30, 13],[31, 12]])

export const light_alt2 = n6
export const light_green_alt2 = n6
export const light_purple_alt2 = n6
const n7 = t([[20, 7],[21, 8],[22, 9],[23, 7],[24, 10],[25, 11],[26, 8],[27, 10]])

export const light_active = n7
export const light_green_active = n7
export const light_purple_active = n7
export const light_Button = n7
export const light_SliderTrackActive = n7
export const light_green_Button = n7
export const light_green_SliderTrackActive = n7
export const light_purple_Button = n7
export const light_purple_SliderTrackActive = n7
export const light_active_SliderTrackActive = n7
export const light_green_active_SliderTrackActive = n7
export const light_purple_active_SliderTrackActive = n7
const n8 = t([[28, 52],[29, 51],[30, 52],[31, 51]])

export const dark_alt1 = n8
export const dark_green_alt1 = n8
export const dark_purple_alt1 = n8
const n9 = t([[28, 51],[29, 50],[30, 51],[31, 50]])

export const dark_alt2 = n9
export const dark_green_alt2 = n9
export const dark_purple_alt2 = n9
const n10 = t([[20, 45],[21, 46],[22, 47],[23, 45],[24, 48],[25, 49],[26, 46],[27, 48]])

export const dark_active = n10
export const dark_green_active = n10
export const dark_purple_active = n10
export const dark_Button = n10
export const dark_SliderTrackActive = n10
export const dark_green_Button = n10
export const dark_green_SliderTrackActive = n10
export const dark_purple_Button = n10
export const dark_purple_SliderTrackActive = n10
export const dark_active_SliderTrackActive = n10
export const dark_green_active_SliderTrackActive = n10
export const dark_purple_active_SliderTrackActive = n10
const n11 = t([[20, 5],[21, 6],[22, 7],[23, 5],[24, 8],[25, 9],[26, 6],[27, 8]])

export const light_ListItem = n11
export const light_SelectTrigger = n11
export const light_Card = n11
export const light_DrawerFrame = n11
export const light_Progress = n11
export const light_TooltipArrow = n11
export const light_SliderTrack = n11
export const light_Input = n11
export const light_TextArea = n11
export const light_green_ListItem = n11
export const light_green_SelectTrigger = n11
export const light_green_Card = n11
export const light_green_DrawerFrame = n11
export const light_green_Progress = n11
export const light_green_TooltipArrow = n11
export const light_green_SliderTrack = n11
export const light_green_Input = n11
export const light_green_TextArea = n11
export const light_purple_ListItem = n11
export const light_purple_SelectTrigger = n11
export const light_purple_Card = n11
export const light_purple_DrawerFrame = n11
export const light_purple_Progress = n11
export const light_purple_TooltipArrow = n11
export const light_purple_SliderTrack = n11
export const light_purple_Input = n11
export const light_purple_TextArea = n11
export const light_active_ListItem = n11
export const light_active_DrawerFrame = n11
export const light_active_Progress = n11
export const light_active_TooltipArrow = n11
export const light_active_SliderTrack = n11
export const light_green_active_ListItem = n11
export const light_green_active_DrawerFrame = n11
export const light_green_active_Progress = n11
export const light_green_active_TooltipArrow = n11
export const light_green_active_SliderTrack = n11
export const light_purple_active_ListItem = n11
export const light_purple_active_DrawerFrame = n11
export const light_purple_active_Progress = n11
export const light_purple_active_TooltipArrow = n11
export const light_purple_active_SliderTrack = n11
const n12 = t([[20, 6],[21, 7],[22, 8],[23, 6],[24, 9],[25, 10],[26, 7],[27, 9]])

export const light_Checkbox = n12
export const light_Switch = n12
export const light_TooltipContent = n12
export const light_RadioGroupItem = n12
export const light_green_Checkbox = n12
export const light_green_Switch = n12
export const light_green_TooltipContent = n12
export const light_green_RadioGroupItem = n12
export const light_purple_Checkbox = n12
export const light_purple_Switch = n12
export const light_purple_TooltipContent = n12
export const light_purple_RadioGroupItem = n12
const n13 = t([[28, 5],[29, 6],[30, 7],[31, 5],[20, 15],[21, 14],[22, 15],[23, 14],[24, 13],[25, 12],[26, 11],[27, 10]])

export const light_SwitchThumb = n13
export const light_SliderThumb = n13
export const light_Tooltip = n13
export const light_ProgressIndicator = n13
export const light_green_SwitchThumb = n13
export const light_green_SliderThumb = n13
export const light_green_Tooltip = n13
export const light_green_ProgressIndicator = n13
export const light_purple_SwitchThumb = n13
export const light_purple_SliderThumb = n13
export const light_purple_Tooltip = n13
export const light_purple_ProgressIndicator = n13
const n14 = t([[20, 76]])

export const light_SheetOverlay = n14
export const light_DialogOverlay = n14
export const light_ModalOverlay = n14
export const light_green_SheetOverlay = n14
export const light_green_DialogOverlay = n14
export const light_green_ModalOverlay = n14
export const light_purple_SheetOverlay = n14
export const light_purple_DialogOverlay = n14
export const light_purple_ModalOverlay = n14
export const light_active_SheetOverlay = n14
export const light_active_DialogOverlay = n14
export const light_active_ModalOverlay = n14
export const light_green_active_SheetOverlay = n14
export const light_green_active_DialogOverlay = n14
export const light_green_active_ModalOverlay = n14
export const light_purple_active_SheetOverlay = n14
export const light_purple_active_DialogOverlay = n14
export const light_purple_active_ModalOverlay = n14
const n15 = t([[20, 43],[21, 44],[22, 45],[23, 43],[24, 46],[25, 47],[26, 44],[27, 46]])

export const dark_ListItem = n15
export const dark_SelectTrigger = n15
export const dark_Card = n15
export const dark_DrawerFrame = n15
export const dark_Progress = n15
export const dark_TooltipArrow = n15
export const dark_SliderTrack = n15
export const dark_Input = n15
export const dark_TextArea = n15
export const dark_green_ListItem = n15
export const dark_green_SelectTrigger = n15
export const dark_green_Card = n15
export const dark_green_DrawerFrame = n15
export const dark_green_Progress = n15
export const dark_green_TooltipArrow = n15
export const dark_green_SliderTrack = n15
export const dark_green_Input = n15
export const dark_green_TextArea = n15
export const dark_purple_ListItem = n15
export const dark_purple_SelectTrigger = n15
export const dark_purple_Card = n15
export const dark_purple_DrawerFrame = n15
export const dark_purple_Progress = n15
export const dark_purple_TooltipArrow = n15
export const dark_purple_SliderTrack = n15
export const dark_purple_Input = n15
export const dark_purple_TextArea = n15
export const dark_active_ListItem = n15
export const dark_active_DrawerFrame = n15
export const dark_active_Progress = n15
export const dark_active_TooltipArrow = n15
export const dark_active_SliderTrack = n15
export const dark_green_active_ListItem = n15
export const dark_green_active_DrawerFrame = n15
export const dark_green_active_Progress = n15
export const dark_green_active_TooltipArrow = n15
export const dark_green_active_SliderTrack = n15
export const dark_purple_active_ListItem = n15
export const dark_purple_active_DrawerFrame = n15
export const dark_purple_active_Progress = n15
export const dark_purple_active_TooltipArrow = n15
export const dark_purple_active_SliderTrack = n15
const n16 = t([[20, 44],[21, 45],[22, 46],[23, 44],[24, 47],[25, 48],[26, 45],[27, 47]])

export const dark_Checkbox = n16
export const dark_Switch = n16
export const dark_TooltipContent = n16
export const dark_RadioGroupItem = n16
export const dark_green_Checkbox = n16
export const dark_green_Switch = n16
export const dark_green_TooltipContent = n16
export const dark_green_RadioGroupItem = n16
export const dark_purple_Checkbox = n16
export const dark_purple_Switch = n16
export const dark_purple_TooltipContent = n16
export const dark_purple_RadioGroupItem = n16
const n17 = t([[28, 43],[29, 44],[30, 45],[31, 43],[20, 53],[21, 52],[22, 53],[23, 52],[24, 51],[25, 50],[26, 49],[27, 48]])

export const dark_SwitchThumb = n17
export const dark_SliderThumb = n17
export const dark_Tooltip = n17
export const dark_ProgressIndicator = n17
export const dark_green_SwitchThumb = n17
export const dark_green_SliderThumb = n17
export const dark_green_Tooltip = n17
export const dark_green_ProgressIndicator = n17
export const dark_purple_SwitchThumb = n17
export const dark_purple_SliderThumb = n17
export const dark_purple_Tooltip = n17
export const dark_purple_ProgressIndicator = n17
const n18 = t([[20, 77]])

export const dark_SheetOverlay = n18
export const dark_DialogOverlay = n18
export const dark_ModalOverlay = n18
export const dark_green_SheetOverlay = n18
export const dark_green_DialogOverlay = n18
export const dark_green_ModalOverlay = n18
export const dark_purple_SheetOverlay = n18
export const dark_purple_DialogOverlay = n18
export const dark_purple_ModalOverlay = n18
export const dark_active_SheetOverlay = n18
export const dark_active_DialogOverlay = n18
export const dark_active_ModalOverlay = n18
export const dark_green_active_SheetOverlay = n18
export const dark_green_active_DialogOverlay = n18
export const dark_green_active_ModalOverlay = n18
export const dark_purple_active_SheetOverlay = n18
export const dark_purple_active_DialogOverlay = n18
export const dark_purple_active_ModalOverlay = n18
const n19 = t([[20, 9],[21, 9],[22, 11],[23, 9],[24, 12],[25, 12],[26, 10],[27, 12]])

export const light_active_SelectTrigger = n19
export const light_active_Card = n19
export const light_active_Button = n19
export const light_active_Checkbox = n19
export const light_active_Switch = n19
export const light_active_TooltipContent = n19
export const light_active_RadioGroupItem = n19
export const light_active_Input = n19
export const light_active_TextArea = n19
export const light_green_active_SelectTrigger = n19
export const light_green_active_Card = n19
export const light_green_active_Button = n19
export const light_green_active_Checkbox = n19
export const light_green_active_Switch = n19
export const light_green_active_TooltipContent = n19
export const light_green_active_RadioGroupItem = n19
export const light_green_active_Input = n19
export const light_green_active_TextArea = n19
export const light_purple_active_SelectTrigger = n19
export const light_purple_active_Card = n19
export const light_purple_active_Button = n19
export const light_purple_active_Checkbox = n19
export const light_purple_active_Switch = n19
export const light_purple_active_TooltipContent = n19
export const light_purple_active_RadioGroupItem = n19
export const light_purple_active_Input = n19
export const light_purple_active_TextArea = n19
const n20 = t([[28, 5],[29, 6],[30, 7],[31, 5],[20, 13],[21, 12],[22, 13],[23, 12],[24, 11],[25, 10],[26, 9],[27, 8]])

export const light_active_SwitchThumb = n20
export const light_active_SliderThumb = n20
export const light_active_Tooltip = n20
export const light_active_ProgressIndicator = n20
export const light_green_active_SwitchThumb = n20
export const light_green_active_SliderThumb = n20
export const light_green_active_Tooltip = n20
export const light_green_active_ProgressIndicator = n20
export const light_purple_active_SwitchThumb = n20
export const light_purple_active_SliderThumb = n20
export const light_purple_active_Tooltip = n20
export const light_purple_active_ProgressIndicator = n20
const n21 = t([[20, 47],[21, 47],[22, 49],[23, 47],[24, 50],[25, 50],[26, 48],[27, 50]])

export const dark_active_SelectTrigger = n21
export const dark_active_Card = n21
export const dark_active_Button = n21
export const dark_active_Checkbox = n21
export const dark_active_Switch = n21
export const dark_active_TooltipContent = n21
export const dark_active_RadioGroupItem = n21
export const dark_active_Input = n21
export const dark_active_TextArea = n21
export const dark_green_active_SelectTrigger = n21
export const dark_green_active_Card = n21
export const dark_green_active_Button = n21
export const dark_green_active_Checkbox = n21
export const dark_green_active_Switch = n21
export const dark_green_active_TooltipContent = n21
export const dark_green_active_RadioGroupItem = n21
export const dark_green_active_Input = n21
export const dark_green_active_TextArea = n21
export const dark_purple_active_SelectTrigger = n21
export const dark_purple_active_Card = n21
export const dark_purple_active_Button = n21
export const dark_purple_active_Checkbox = n21
export const dark_purple_active_Switch = n21
export const dark_purple_active_TooltipContent = n21
export const dark_purple_active_RadioGroupItem = n21
export const dark_purple_active_Input = n21
export const dark_purple_active_TextArea = n21
const n22 = t([[28, 43],[29, 44],[30, 45],[31, 43],[20, 51],[21, 50],[22, 51],[23, 50],[24, 49],[25, 48],[26, 47],[27, 46]])

export const dark_active_SwitchThumb = n22
export const dark_active_SliderThumb = n22
export const dark_active_Tooltip = n22
export const dark_active_ProgressIndicator = n22
export const dark_green_active_SwitchThumb = n22
export const dark_green_active_SliderThumb = n22
export const dark_green_active_Tooltip = n22
export const dark_green_active_ProgressIndicator = n22
export const dark_purple_active_SwitchThumb = n22
export const dark_purple_active_SliderThumb = n22
export const dark_purple_active_Tooltip = n22
export const dark_purple_active_ProgressIndicator = n22