By default, all Pathfora modules have a responsive design which will scale for screen size and device. Larger modules such as [gate](/types/gate) or [modals](/layouts/modal) will likely take up the full screen space on a mobile device. Smaller modules such as [bar](/layouts/bar) and [slideout](/layouts/slideout) will fit completely within a mobile screen if the content is short enough, and scroll otherwise. The responsive behavior can be turned off if you would not like to show your modules on smaller screen sizes.

## responsive

Turn on or off responsive styles for windows of certain dimensions.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>responsive</code> boolean</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>true</td>
    <td><code>default</code> modules will scale for any browser size</td>
  </tr>
  <tr>
    <td>false</td>
    <td>modules will be hidden for windows less than 768px in width or less than 640px in height</td>
  </tr>
</table>
