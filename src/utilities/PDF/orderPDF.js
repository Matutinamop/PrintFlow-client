import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer';

const MyPDF = ({ order }) => {
  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Klavika',
      padding: '20px',
      width: '800px',
    },
    header: {},
    content: {},
    block: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: '2px',
      flexWrap: 'wrap',
      marginTop: '10px',
      padding: '5px',
      backgroundColor: 'rgba(67, 74, 211, 0.1)',
      border: '1px solid #aaa',
      borderRadius: '5px',
    },
  });

  Font.register({
    family: 'Klavika',
    src: '/fonts/Klavika-Regular.ttf',
  });

  Font.register({
    family: 'Klavika',
    src: '/fonts/Klavika-Medium.ttf',
    fontWeight: 'medium',
  });

  Font.register({
    family: 'Klavika',
    src: '/fonts/Klavika-Bold.ttf',
    fontWeight: 'bold',
  });

  return (
    <Document>
      <Page style={styles.page} size='A4'>
        <View>
          <Text>HEADER</Text>
        </View>
        <View style={styles.block}>
          <View style={{ flexDirection: 'column' }}>
            <Text>Familia: {order?.product}</Text>
            <Text>Fecha Estimada: {order?.dateEstimate}</Text>
            <Text>Fecha Limite: {order?.dateFinal}</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text>
              Cliente: {order?.client.companyName} {order?.client?.phone}
            </Text>
            <Text>Informacion de contacto:</Text>
            <Text>Nombre</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const createOrderPDF = async (order) => {
  const blob = await pdf(<MyPDF order={order} />).toBlob(); // Genera el PDF en Blob
  const url = URL.createObjectURL(blob); // Crea la URL temporal
  window.open(url, '_blank');
}; // Abre el modal
